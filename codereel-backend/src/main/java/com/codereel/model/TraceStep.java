package com.codereel.model;

import lombok.Data;
import lombok.Builder;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TraceStep {
    private int stepIndex;
    private int lineNumber;
    private String sourceCode;
    private List<Variable> variables;
    private List<CallFrame> callStack;
    private String consoleOutput;
    private List<HeapObject> heapObjects;
    private DataStructures dataStructures;
    private String event;        // "line", "call", "return", "exception", "stdout"
    private String description;

    // ─── Nested types ─────────────────────────────────────────────────

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Variable {
        private String name;
        private String type;
        private Object value;
        private boolean changed;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CallFrame {
        private String methodName;
        private String className;
        private int lineNumber;
        private List<Variable> variables;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class HeapObject {
        private String id;
        private String type;
        private Map<String, Object> fields;
        private List<String> references;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class DataStructures {
        private List<ArraySnapshot> arrays;
        private List<StackSnapshot> stacks;
        private List<QueueSnapshot> queues;
        private List<LinkedListSnapshot> linkedLists;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ArraySnapshot {
        private String name;
        private List<Object> elements;
        private Integer highlightIndex;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class StackSnapshot {
        private String name;
        private List<Object> elements;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class QueueSnapshot {
        private String name;
        private List<Object> elements;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class LinkedListSnapshot {
        private String name;
        private List<LinkedListNode> nodes;
        private String headId;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class LinkedListNode {
        private String id;
        private Object value;
        private String next;
    }
}
