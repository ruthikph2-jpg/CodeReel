import { useCurrentStep } from '@/store'
import { Layers3 } from 'lucide-react'

export function CallStackPanel() {
  const step = useCurrentStep()
  const frames = step?.callStack ?? []

  return (
    <div className="panel overflow-hidden flex flex-col h-full">
      <div className="panel-header">
        <Layers3 size={14} className="text-orange-400" />
        Call Stack
        <span className="ml-auto badge bg-surface-600 text-gray-400">{frames.length}</span>
      </div>
      <div className="flex-1 overflow-y-auto p-3 flex flex-col-reverse gap-1">
        {frames.length === 0 && (
          <p className="text-gray-600 text-sm italic text-center py-6">Stack empty</p>
        )}
        {frames.map((frame, i) => (
          <div
            key={`${frame.methodName}-${i}`}
            className={`px-3 py-2 rounded-lg text-sm border-l-2 ${
              i === frames.length - 1
                ? 'border-orange-400 bg-orange-400/10'
                : 'border-surface-500 bg-surface-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono font-medium text-white">
                {frame.className}.{frame.methodName}()
              </span>
              <span className="text-gray-500 text-xs font-mono">:{frame.lineNumber}</span>
            </div>
            {frame.variables.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-1">
                {frame.variables.slice(0, 4).map((v) => (
                  <span key={v.name} className="text-[10px] bg-surface-600 text-gray-400 px-1.5 py-0.5 rounded font-mono">
                    {v.name}={v.value === null ? 'null' : String(v.value)}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
