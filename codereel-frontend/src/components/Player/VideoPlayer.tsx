import {
  Play, Pause, SkipBack, SkipForward, RotateCcw,
  ChevronLeft, ChevronRight, Gauge
} from 'lucide-react'
import { useStore } from '@/store'
import { useAutoplay } from '@/hooks/useExecution'
import type { PlaybackSpeed } from '@/types'
import { clsx } from 'clsx'

const SPEEDS: PlaybackSpeed[] = [0.25, 0.5, 1, 2, 4]

export function VideoPlayer() {
  useAutoplay()

  const {
    player,
    currentStep,
    trace,
    setCurrentStep,
    stepForward,
    stepBackward,
    setPlaying,
    setSpeed,
    reset,
  } = useStore()

  const { isPlaying, speed, totalSteps } = player
  const progress = totalSteps > 0 ? (currentStep / (totalSteps - 1)) * 100 : 0
  const hasTrace = trace != null

  const togglePlay = () => {
    if (currentStep >= totalSteps - 1) {
      setCurrentStep(0)
    }
    setPlaying(!isPlaying)
  }

  return (
    <div className="panel p-3 flex flex-col gap-3">
      {/* Timeline scrubber */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-500 font-mono w-8 text-right">{currentStep + 1}</span>
        <input
          type="range"
          min={0}
          max={Math.max(totalSteps - 1, 0)}
          value={currentStep}
          onChange={(e) => setCurrentStep(Number(e.target.value))}
          disabled={!hasTrace}
          className="flex-1 h-1.5 accent-brand-500 cursor-pointer disabled:opacity-30"
        />
        <span className="text-xs text-gray-500 font-mono w-8">{totalSteps}</span>
      </div>

      {/* Controls row */}
      <div className="flex items-center justify-between">
        {/* Left: Transport controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentStep(0)}
            disabled={!hasTrace || currentStep === 0}
            className="btn-ghost p-2"
            title="Jump to start"
          >
            <SkipBack size={16} />
          </button>
          <button
            onClick={stepBackward}
            disabled={!hasTrace || currentStep === 0}
            className="btn-ghost p-2"
            title="Step back"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={togglePlay}
            disabled={!hasTrace}
            className={clsx(
              'w-9 h-9 rounded-lg flex items-center justify-center transition-colors',
              hasTrace
                ? 'bg-brand-500 hover:bg-brand-600 text-white'
                : 'bg-surface-600 text-gray-500 cursor-not-allowed'
            )}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <button
            onClick={stepForward}
            disabled={!hasTrace || currentStep >= totalSteps - 1}
            className="btn-ghost p-2"
            title="Step forward"
          >
            <ChevronRight size={16} />
          </button>
          <button
            onClick={() => setCurrentStep(totalSteps - 1)}
            disabled={!hasTrace || currentStep >= totalSteps - 1}
            className="btn-ghost p-2"
            title="Jump to end"
          >
            <SkipForward size={16} />
          </button>
          <button
            onClick={reset}
            disabled={!hasTrace}
            className="btn-ghost p-2"
            title="Reset"
          >
            <RotateCcw size={14} />
          </button>
        </div>

        {/* Right: Speed control */}
        <div className="flex items-center gap-2">
          <Gauge size={14} className="text-gray-500" />
          <div className="flex gap-1">
            {SPEEDS.map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={clsx(
                  'text-xs px-2 py-1 rounded font-mono transition-colors',
                  speed === s
                    ? 'bg-brand-500/20 text-brand-400 font-bold'
                    : 'text-gray-500 hover:text-gray-300 hover:bg-surface-600'
                )}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-0.5 bg-surface-600 rounded-full overflow-hidden">
        <div
          className="h-full bg-brand-500 transition-all duration-200 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
