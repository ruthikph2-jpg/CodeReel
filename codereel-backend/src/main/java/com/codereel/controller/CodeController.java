package com.codereel.controller;

import com.codereel.model.CodeRequest;
import com.codereel.model.ExecutionTrace;
import com.codereel.service.CodeExecutionService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CodeController {

    private final CodeExecutionService executionService;

    /**
     * POST /api/execute — compile and trace Java code
     */
    @PostMapping("/execute")
    public ResponseEntity<?> execute(
            @Valid @RequestBody CodeRequest request,
            HttpServletRequest httpRequest
    ) {
        log.info("Execute request from {}", httpRequest.getRemoteAddr());
        try {
            ExecutionTrace trace = executionService.execute(request);
            return ResponseEntity.ok(Map.of(
                    "trace", trace,
                    "output", trace.getSteps().stream()
                            .map(s -> s.getConsoleOutput())
                            .filter(o -> o != null && !o.isBlank())
                            .findFirst().orElse("")
            ));
        } catch (Exception e) {
            log.error("Execution failed", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("message", "Internal server error: " + e.getMessage()));
        }
    }

    /**
     * GET /api/health
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "UP", "service", "CodeReel"));
    }
}
