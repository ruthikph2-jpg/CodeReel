package com.codereel.model;

import lombok.Data;
import lombok.Builder;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ExecutionTrace {
    private String id;
    private String sourceCode;
    private List<TraceStep> steps;
    private int totalSteps;
    private boolean hasError;
    private String errorMessage;
    private long executionTimeMs;

    public static ExecutionTrace empty(String code) {
        return ExecutionTrace.builder()
                .id(UUID.randomUUID().toString())
                .sourceCode(code)
                .steps(List.of())
                .totalSteps(0)
                .hasError(false)
                .executionTimeMs(0)
                .build();
    }
}
