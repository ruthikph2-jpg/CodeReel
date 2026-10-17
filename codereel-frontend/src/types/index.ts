// ─── Execution Trace Types ────────────────────────────────────────────────────

export interface Variable {
  name: string;
  type: string;
  value: string | number | boolean | null;
  changed?: boolean;
}

export interface CallFrame {
  methodName: string;
  className: string;
  lineNumber: number;
  variables: Variable[];
}

export interface HeapObject {
  id: string;
  type: string;
  fields: Record<string, string | number | boolean | null>;
  references: string[];
}

export interface TraceStep {
  stepIndex: number;
  lineNumber: number;
  sourceCode: string;
  variables: Variable[];
  callStack: CallFrame[];
  consoleOutput: string;
  heapObjects: HeapObject[];
  dataStructures: DataStructureSnapshot;
  event: 'line' | 'call' | 'return' | 'exception' | 'stdout';
  description?: string;
}

export interface DataStructureSnapshot {
  arrays: ArraySnapshot[];
  stacks: StackSnapshot[];
  queues: QueueSnapshot[];
  linkedLists: LinkedListSnapshot[];
}

export interface ArraySnapshot {
  name: string;
  elements: (number | string | null)[];
  highlightIndex?: number;
}

export interface StackSnapshot {
  name: string;
  elements: (number | string | null)[];
}

export interface QueueSnapshot {
  name: string;
  elements: (number | string | null)[];
}

export interface LinkedListNode {
  value: number | string | null;
  next: string | null;
  id: string;
}

export interface LinkedListSnapshot {
  name: string;
  nodes: LinkedListNode[];
  headId: string | null;
}

export interface ExecutionTrace {
  id: string;
  sourceCode: string;
  steps: TraceStep[];
  totalSteps: number;
  hasError: boolean;
  errorMessage?: string;
  executionTimeMs: number;
}

// ─── Code Execution ───────────────────────────────────────────────────────────

export interface CodeRequest {
  code: string;
  language: 'java';
  stdin?: string;
}

export interface ExecutionResult {
  trace: ExecutionTrace;
  output: string;
  error?: string;
}

// ─── Snippet / User ───────────────────────────────────────────────────────────

export interface Snippet {
  id: string;
  title: string;
  code: string;
  language: 'java';
  createdAt: string;
  updatedAt: string;
  shareToken?: string;
  isPublic: boolean;
  author?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  provider: 'github' | 'google';
}

// ─── Player ───────────────────────────────────────────────────────────────────

export type PlaybackSpeed = 0.25 | 0.5 | 1 | 2 | 4;

export interface PlayerState {
  isPlaying: boolean;
  currentStep: number;
  totalSteps: number;
  speed: PlaybackSpeed;
}

// ─── TwinRun ──────────────────────────────────────────────────────────────────

export interface TwinRunState {
  leftTrace: ExecutionTrace | null;
  rightTrace: ExecutionTrace | null;
  leftCode: string;
  rightCode: string;
  syncedStep: boolean;
}
