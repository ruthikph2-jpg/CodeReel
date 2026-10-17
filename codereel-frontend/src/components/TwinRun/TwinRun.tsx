import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Loader2, SplitSquareHorizontal } from 'lucide-react'
import { CodeEditor } from '@/components/Editor/CodeEditor'
import { VideoPlayer } from '@/components/Player/VideoPlayer'
import { VariablePanel } from '@/components/Panels/VariablePanel'
import { ConsolePanel } from '@/components/Panels/ConsolePanel'
import { ArrayViz } from '@/components/Visualizations/ArrayViz'
import { executeCode } from '@/api'
import type { ExecutionTrace } from '@/types'
import toast from 'react-hot-toast'

const DEFAULT_LEFT = `// Program A: Bubble Sort
import java.util.*;
public class Main {
    public static void main(String[] args) {
        int[] arr = {5, 3, 8, 1, 9, 2};
        for (int i = 0; i < arr.length - 1; i++)
            for (int j = 0; j < arr.length - i - 1; j++)
                if (arr[j] > arr[j+1]) {
                    int t = arr[j]; arr[j] = arr[j+1]; arr[j+1] = t;
                }
        System.out.println(Arrays.toString(arr));
    }
}`

const DEFAULT_RIGHT = `// Program B: Selection Sort
import java.util.*;
public class Main {
    public static void main(String[] args) {
        int[] arr = {5, 3, 8, 1, 9, 2};
        for (int i = 0; i < arr.length - 1; i++) {
            int minIdx = i;
            for (int j = i + 1; j < arr.length; j++)
                if (arr[j] < arr[minIdx]) minIdx = j;
            int t = arr[minIdx]; arr[minIdx] = arr[i]; arr[i] = t;
        }
        System.out.println(Arrays.toString(arr));
    }
}`

interface TwinState {
  code: string
  trace: ExecutionTrace | null
  step: number
  loading: boolean
}

export function TwinRun() {
  const [synced, setSynced] = useState(true)

  const [left, setLeft] = useState<TwinState>({
    code: DEFAULT_LEFT, trace: null, step: 0, loading: false,
  })
  const [right, setRight] = useState<TwinState>({
    code: DEFAULT_RIGHT, trace: null, step: 0, loading: false,
  })

  const runSide = async (side: 'left' | 'right') => {
    const current = side === 'left' ? left : right
    const setter = side === 'left' ? setLeft : setRight

    setter((s) => ({ ...s, loading: true }))
    try {
      const result = await executeCode({ code: current.code, language: 'java' })
      setter((s) => ({ ...s, trace: result.trace, step: 0, loading: false }))
      toast.success(`${side === 'left' ? 'Left' : 'Right'}: ${result.trace.totalSteps} steps`)
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? 'Execution failed')
      setter((s) => ({ ...s, loading: false }))
    }
  }

  const setStep = (side: 'left' | 'right', v: number) => {
    if (synced) {
      setLeft((s) => ({ ...s, step: v }))
      setRight((s) => ({ ...s, step: v }))
    } else {
      if (side === 'left') setLeft((s) => ({ ...s, step: v }))
      else setRight((s) => ({ ...s, step: v }))
    }
  }

  return (
    <div className="flex flex-col gap-4 p-4 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SplitSquareHorizontal className="text-brand-400" size={20} />
          <h2 className="font-bold text-lg">TwinRun</h2>
          <span className="text-gray-500 text-sm">Compare two Java programs side by side</span>
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
          <input
            type="checkbox"
            checked={synced}
            onChange={(e) => setSynced(e.target.checked)}
            className="accent-brand-500"
          />
          Sync steps
        </label>
      </div>

      {/* Panels */}
      <div className="grid grid-cols-2 gap-4 flex-1 min-h-0">
        {[{ side: 'left' as const, state: left, setState: setLeft },
          { side: 'right' as const, state: right, setState: setRight }].map(({ side, state, setState }) => (
          <div key={side} className="flex flex-col gap-3 min-h-0">
            {/* Editor */}
            <div className="panel flex-1 overflow-hidden flex flex-col min-h-0">
              <div className="panel-header justify-between">
                <span className="capitalize">{side} Program</span>
                <button
                  onClick={() => runSide(side)}
                  disabled={state.loading}
                  className="btn-primary py-1 text-xs"
                >
                  {state.loading ? <Loader2 size={12} className="animate-spin" /> : <Play size={12} />}
                  Run
                </button>
              </div>
              <div className="flex-1 min-h-0">
                <CodeEditor
                  value={state.code}
                  onChange={(v) => setState((s) => ({ ...s, code: v }))}
                  highlightLine={state.trace?.steps[state.step]?.lineNumber}
                />
              </div>
            </div>

            {/* Mini player */}
            {state.trace && (
              <div>
                <div className="flex items-center gap-3 text-xs text-gray-500 mb-1">
                  <span>Step {state.step + 1} / {state.trace.totalSteps}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={state.trace.totalSteps - 1}
                  value={state.step}
                  onChange={(e) => setStep(side, Number(e.target.value))}
                  className="w-full accent-brand-500 h-1.5"
                />
              </div>
            )}

            {/* Variables */}
            {state.trace && (
              <div className="h-40 overflow-hidden">
                <div className="panel h-full overflow-y-auto p-3">
                  {(state.trace.steps[state.step]?.variables ?? []).map((v) => (
                    <div key={v.name} className="flex justify-between text-xs py-1 border-b border-surface-600">
                      <span className="text-gray-400 font-mono">{v.name}</span>
                      <span className="text-cyan-300 font-mono font-bold">
                        {v.value === null ? 'null' : String(v.value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
