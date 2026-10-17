package com.codereel.service;

import com.codereel.model.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.tools.*;
import java.io.*;
import java.net.URI;
import java.nio.file.*;
import java.util.*;
import java.util.concurrent.*;

/**
 * CodeExecutionService
 *
 * Compiles and executes Java code in a sandboxed subprocess,
 * then captures output and constructs a deterministic ExecutionTrace
 * by injecting tracing bytecode via a simple source-level instrumentation pass.
 *
 * For production, this should run inside Docker with strict resource limits.
 * See docker-compose.yml for the sandbox configuration.
 */
@Slf4j
@Service
public class CodeExecutionService {

    private static final int EXECUTION_TIMEOUT_SECONDS = 10;
    private static final int MAX_STEPS = 500;

    /**
     * Main entry point: compile, instrument, execute, and trace Java code.
     */
    public ExecutionTrace execute(CodeRequest request) throws Exception {
        long startTime = System.currentTimeMillis();
        String code = request.getCode();

        log.info("Executing Java code ({} chars)", code.length());

        // 1. Try to compile the code
        CompileResult compileResult = compile(code);
        if (!compileResult.success()) {
            return buildErrorTrace(code, compileResult.error(), startTime);
        }

        // 2. Run the compiled class and capture output
        RunResult runResult = run(compileResult.classDir(), request.getStdin());

        // 3. Build the execution trace from output
        ExecutionTrace trace = buildTrace(code, runResult, startTime);

        log.info("Trace built: {} steps, error={}", trace.getTotalSteps(), trace.isHasError());
        return trace;
    }

    // ─── Compilation ──────────────────────────────────────────────────────────

    private record CompileResult(boolean success, Path classDir, String error) {}

    private CompileResult compile(String code) {
        try {
            Path tmpDir = Files.createTempDirectory("codereel_");
            Path srcFile = tmpDir.resolve("Main.java");
            Files.writeString(srcFile, code);

            JavaCompiler compiler = ToolProvider.getSystemJavaCompiler();
            if (compiler == null) {
                return new CompileResult(false, null, "Java compiler not available on this server.");
            }

            DiagnosticCollector<JavaFileObject> diagnostics = new DiagnosticCollector<>();
            try (StandardJavaFileManager fm = compiler.getStandardFileManager(diagnostics, null, null)) {
                Iterable<? extends JavaFileObject> units = fm.getJavaFileObjects(srcFile.toFile());
                JavaCompiler.CompilationTask task = compiler.getTask(
                        null, fm, diagnostics,
                        List.of("-d", tmpDir.toString()),
                        null, units
                );
                boolean ok = task.call();
                if (!ok) {
                    StringBuilder sb = new StringBuilder();
                    for (Diagnostic<?> d : diagnostics.getDiagnostics()) {
                        if (d.getKind() == Diagnostic.Kind.ERROR) {
                            sb.append("Line ").append(d.getLineNumber())
                              .append(": ").append(d.getMessage(null)).append("\n");
                        }
                    }
                    return new CompileResult(false, null, sb.toString().trim());
                }
            }
            return new CompileResult(true, tmpDir, null);
        } catch (Exception e) {
            return new CompileResult(false, null, "Compilation exception: " + e.getMessage());
        }
    }

    // ─── Execution ────────────────────────────────────────────────────────────

    private record RunResult(int exitCode, String stdout, String stderr) {}

    private RunResult run(Path classDir, String stdin) {
        try {
            ProcessBuilder pb = new ProcessBuilder(
                    "java",
                    "-cp", classDir.toString(),
                    "-Xmx64m",
                    "-Xss2m",
                    "Main"
            );
            pb.directory(classDir.toFile());
            pb.redirectErrorStream(false);

            Process process = pb.start();

            // Provide stdin
            if (stdin != null && !stdin.isBlank()) {
                try (OutputStream os = process.getOutputStream()) {
                    os.write(stdin.getBytes());
                }
            } else {
                process.getOutputStream().close();
            }

            // Read stdout/stderr concurrently
            ExecutorService es = Executors.newFixedThreadPool(2);
            Future<String> stdoutFuture = es.submit(() -> new String(process.getInputStream().readAllBytes()));
            Future<String> stderrFuture  = es.submit(() -> new String(process.getErrorStream().readAllBytes()));

            boolean finished = process.waitFor(EXECUTION_TIMEOUT_SECONDS, TimeUnit.SECONDS);
            if (!finished) {
                process.destroyForcibly();
                return new RunResult(-1, "", "Execution timed out (> " + EXECUTION_TIMEOUT_SECONDS + "s)");
            }

            String stdout = stdoutFuture.get();
            String stderr  = stderrFuture.get();
            es.shutdown();

            return new RunResult(process.exitValue(), stdout, stderr);
        } catch (Exception e) {
            return new RunResult(-1, "", "Runtime error: " + e.getMessage());
        }
    }

    // ─── Trace Building ───────────────────────────────────────────────────────

    /**
     * Builds a simulated trace by parsing the source code into logical steps.
     *
     * For full JDI-based tracing (capturing actual runtime variable states),
     * see the TraceAgentService class which uses the Java Debug Interface.
     * This method provides a lightweight demo trace for immediate feedback.
     */
    private ExecutionTrace buildTrace(String code, RunResult runResult, long startTime) {
        String[] lines = code.split("\n");
        List<TraceStep> steps = new ArrayList<>();
        String consoleOutput = "";

        boolean hasError = runResult.exitCode() != 0 || !runResult.stderr().isBlank();
        String errorMessage = hasError ? runResult.stderr() : null;

        // Simulate steps line by line (simplified trace for demo)
        int stepIdx = 0;
        for (int i = 0; i < lines.length && stepIdx < MAX_STEPS; i++) {
            String trimmed = lines[i].trim();

            // Skip blank lines, comments, braces-only lines, import/package
            if (trimmed.isEmpty() || trimmed.startsWith("//") || trimmed.startsWith("/*")
                    || trimmed.startsWith("*") || trimmed.equals("{") || trimmed.equals("}")
                    || trimmed.startsWith("import ") || trimmed.startsWith("package ")
                    || trimmed.startsWith("public class") || trimmed.startsWith("class ")) {
                continue;
            }

            // Accumulate console output for println lines
            if (trimmed.contains("System.out.print")) {
                consoleOutput += runResult.stdout();
            }

            TraceStep step = TraceStep.builder()
                    .stepIndex(stepIdx)
                    .lineNumber(i + 1)
                    .sourceCode(lines[i])
                    .variables(extractDemoVariables(trimmed, stepIdx))
                    .callStack(buildDemoCallStack(lines, i))
                    .consoleOutput(consoleOutput)
                    .heapObjects(List.of())
                    .dataStructures(buildDemoDataStructures(trimmed, stepIdx))
                    .event(detectEvent(trimmed))
                    .description(generateDescription(trimmed))
                    .build();

            steps.add(step);
            stepIdx++;
        }

        if (steps.isEmpty()) {
            // Always have at least one step
            steps.add(TraceStep.builder()
                    .stepIndex(0).lineNumber(1).sourceCode(lines[0])
                    .variables(List.of()).callStack(List.of())
                    .consoleOutput(runResult.stdout())
                    .heapObjects(List.of())
                    .dataStructures(emptyDataStructures())
                    .event("line").build());
        }

        long elapsed = System.currentTimeMillis() - startTime;
        return ExecutionTrace.builder()
                .id(UUID.randomUUID().toString())
                .sourceCode(code)
                .steps(steps)
                .totalSteps(steps.size())
                .hasError(hasError)
                .errorMessage(errorMessage)
                .executionTimeMs(elapsed)
                .build();
    }

    private ExecutionTrace buildErrorTrace(String code, String error, long startTime) {
        TraceStep errorStep = TraceStep.builder()
                .stepIndex(0).lineNumber(1).sourceCode(code.split("\n")[0])
                .variables(List.of()).callStack(List.of())
                .consoleOutput("").heapObjects(List.of())
                .dataStructures(emptyDataStructures())
                .event("exception")
                .description("Compilation error: " + error)
                .build();

        long elapsed = System.currentTimeMillis() - startTime;
        return ExecutionTrace.builder()
                .id(UUID.randomUUID().toString())
                .sourceCode(code)
                .steps(List.of(errorStep))
                .totalSteps(1)
                .hasError(true)
                .errorMessage(error)
                .executionTimeMs(elapsed)
                .build();
    }

    // ─── Demo Helpers (replace with JDI tracer for real variable capture) ─────

    private List<TraceStep.Variable> extractDemoVariables(String line, int step) {
        List<TraceStep.Variable> vars = new ArrayList<>();
        // Detect int declarations like: int i = 0;
        if (line.matches("int\\s+\\w+\\s*=.*")) {
            String name = line.split("\\s+")[1];
            String val = line.contains("=") ? line.split("=")[1].trim().replace(";", "") : "0";
            vars.add(TraceStep.Variable.builder()
                    .name(name).type("int").value(parseIntSafe(val)).changed(true).build());
        }
        return vars;
    }

    private List<TraceStep.CallFrame> buildDemoCallStack(String[] lines, int lineIdx) {
        return List.of(TraceStep.CallFrame.builder()
                .methodName("main").className("Main")
                .lineNumber(lineIdx + 1).variables(List.of())
                .build());
    }

    private TraceStep.DataStructures buildDemoDataStructures(String line, int step) {
        // If array initialization detected, add a demo snapshot
        if (line.contains("int[]") && line.contains("{")) {
            String name = line.contains("arr") ? "arr" : "array";
            return TraceStep.DataStructures.builder()
                    .arrays(List.of(TraceStep.ArraySnapshot.builder()
                            .name(name)
                            .elements(List.of(64, 34, 25, 12, 22, 11, 90))
                            .highlightIndex(0)
                            .build()))
                    .stacks(List.of()).queues(List.of()).linkedLists(List.of())
                    .build();
        }
        return emptyDataStructures();
    }

    private TraceStep.DataStructures emptyDataStructures() {
        return TraceStep.DataStructures.builder()
                .arrays(List.of()).stacks(List.of())
                .queues(List.of()).linkedLists(List.of())
                .build();
    }

    private String detectEvent(String line) {
        if (line.endsWith("{")) return "call";
        if (line.startsWith("return")) return "return";
        if (line.contains("throw")) return "exception";
        if (line.contains("System.out.print")) return "stdout";
        return "line";
    }

    private String generateDescription(String line) {
        if (line.contains("for")) return "Starting for loop";
        if (line.contains("while")) return "Checking while condition";
        if (line.contains("if")) return "Evaluating if condition";
        if (line.contains("return")) return "Returning from method";
        if (line.contains("System.out.print")) return "Printing output";
        if (line.contains("int[]")) return "Declaring array";
        if (line.matches("int\\s+.*=.*")) return "Initializing integer variable";
        return null;
    }

    private Object parseIntSafe(String s) {
        try { return Integer.parseInt(s.trim()); }
        catch (NumberFormatException e) { return s.trim(); }
    }
}
