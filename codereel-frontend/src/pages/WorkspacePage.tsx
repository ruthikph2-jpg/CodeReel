import { useState } from 'react'
import { Play, Loader2, Lightbulb } from 'lucide-react'
import { CodeEditor } from '@/components/Editor/CodeEditor'
import { VideoPlayer } from '@/components/Player/VideoPlayer'
import { VariablePanel } from '@/components/Panels/VariablePanel'
import { CallStackPanel } from '@/components/Panels/CallStackPanel'
import { ConsolePanel } from '@/components/Panels/ConsolePanel'
import { ArrayViz } from '@/components/Visualizations/ArrayViz'
import { StackViz } from '@/components/Visualizations/StackViz'
import { QueueViz } from '@/components/Visualizations/QueueViz'
import { LinkedListViz } from '@/components/Visualizations/LinkedListViz'
import { PredictMode } from '@/components/PredictMode/PredictMode'
import { useStore, useCurrentStep } from '@/store'
import { useExecution } from '@/hooks/useExecution'

export function WorkspacePage() {
  const { isLoading } = useExecution()
  const { run } = useExecution()
  const step = useCurrentStep()
  const { trace, error } = useStore()

  return (
    <div className="flex flex-col h-[calc(100vh-56px)] p-4 gap-4 overflow-hidden">
      {/* Player bar */}
      <VideoPlayer />

      <div className="flex flex-1 gap-4 min-h-0">
        {/* LEFT: Editor */}
        <div className="flex flex-col gap-3 w-[42%] min-h-0">
          <div className="panel flex-1 overflow-hidden flex flex-col min-h-0">
            <div className="panel-header justify-between">
              <span>Editor — Java</span>
              <div className="flex items-center gap-2">
                {step && (
                  <span className="text-xs text-brand-400 font-mono">
                    Line {step.lineNumber}
                  </span>
                )}
                <button
                  onClick={run}
                  disabled={isLoading}
                  className="btn-primary py-1.5 text-xs"
                >
                  {isLoading
                    ? <><Loader2 size={13} className="animate-spin" /> Tracing...</>
                    : <><Play size={13} /> Run & Trace</>}
                </button>
              </div>
            </div>
            <div className="flex-1 min-h-0">
              <CodeEditor highlightLine={step?.lineNumber} />
            </div>
          </div>

          {/* Step description */}
          {step?.description && (
            <div className="panel px-4 py-3 flex items-start gap-2">
              <Lightbulb size={14} className="text-yellow-400 mt-0.5 shrink-0" />
              <p className="text-sm text-gray-300">{step.description}</p>
            </div>
          )}

          {/* Error banner */}
          {error && (
            <div className="panel border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              ⚠ {error}
            </div>
          )}
        </div>

        {/* RIGHT: Panels */}
        <div className="flex flex-col gap-3 flex-1 min-h-0 overflow-y-auto">
          {/* Data structure visualizations */}
          <ArrayViz />
          <StackViz />
          <QueueViz />
          <LinkedListViz />

          {/* Info panels */}
          <div className="grid grid-cols-2 gap-3">
            <div className="h-56">
              <VariablePanel />
            </div>
            <div className="h-56">
              <CallStackPanel />
            </div>
          </div>

          {/* Console */}
          <div className="h-40">
            <ConsolePanel />
          </div>

          {/* Predict Mode */}
          <PredictMode />

          {/* Empty state */}
          {!trace && !isLoading && (
            <div className="panel p-8 text-center text-gray-500">
              <Play size={32} className="mx-auto mb-3 text-brand-500/40" />
              <p className="text-sm">Click <strong className="text-brand-400">Run & Trace</strong> to start visualizing your Java code</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
