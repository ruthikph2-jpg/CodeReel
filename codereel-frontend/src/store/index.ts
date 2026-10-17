import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import type {
  ExecutionTrace,
  TraceStep,
  PlayerState,
  PlaybackSpeed,
  Snippet,
  User,
} from '@/types'

// ─── Execution Store ──────────────────────────────────────────────────────────
interface ExecutionState {
  code: string;
  trace: ExecutionTrace | null;
  currentStep: number;
  isLoading: boolean;
  error: string | null;
  player: PlayerState;
  snippets: Snippet[];
  user: User | null;

  setCode: (code: string) => void;
  setTrace: (trace: ExecutionTrace) => void;
  setCurrentStep: (step: number) => void;
  stepForward: () => void;
  stepBackward: () => void;
  setPlaying: (playing: boolean) => void;
  setSpeed: (speed: PlaybackSpeed) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSnippets: (snippets: Snippet[]) => void;
  setUser: (user: User | null) => void;
  reset: () => void;
}

const DEFAULT_CODE = `import java.util.*;

public class Main {
    public static void main(String[] args) {
        // Try sorting an array!
        int[] arr = {64, 34, 25, 12, 22, 11, 90};
        bubbleSort(arr);
        System.out.println(Arrays.toString(arr));
    }

    static void bubbleSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
    }
}
`

export const useStore = create<ExecutionState>()(
  immer((set, get) => ({
    code: DEFAULT_CODE,
    trace: null,
    currentStep: 0,
    isLoading: false,
    error: null,
    player: {
      isPlaying: false,
      currentStep: 0,
      totalSteps: 0,
      speed: 1,
    },
    snippets: [],
    user: null,

    setCode: (code) => set((s) => { s.code = code }),
    setTrace: (trace) => set((s) => {
      s.trace = trace
      s.currentStep = 0
      s.player.totalSteps = trace.totalSteps
      s.player.currentStep = 0
      s.error = null
    }),
    setCurrentStep: (step) => set((s) => {
      s.currentStep = step
      s.player.currentStep = step
    }),
    stepForward: () => {
      const { currentStep, trace } = get()
      if (trace && currentStep < trace.totalSteps - 1) {
        set((s) => {
          s.currentStep++
          s.player.currentStep++
        })
      }
    },
    stepBackward: () => {
      const { currentStep } = get()
      if (currentStep > 0) {
        set((s) => {
          s.currentStep--
          s.player.currentStep--
        })
      }
    },
    setPlaying: (playing) => set((s) => { s.player.isPlaying = playing }),
    setSpeed: (speed) => set((s) => { s.player.speed = speed }),
    setLoading: (loading) => set((s) => { s.isLoading = loading }),
    setError: (error) => set((s) => { s.error = error }),
    setSnippets: (snippets) => set((s) => { s.snippets = snippets }),
    setUser: (user) => set((s) => { s.user = user }),
    reset: () => set((s) => {
      s.trace = null
      s.currentStep = 0
      s.error = null
      s.player = { isPlaying: false, currentStep: 0, totalSteps: 0, speed: 1 }
    }),
  }))
)

// ─── Derived selectors ────────────────────────────────────────────────────────
export const useCurrentStep = (): TraceStep | null => {
  const { trace, currentStep } = useStore()
  return trace?.steps[currentStep] ?? null
}
