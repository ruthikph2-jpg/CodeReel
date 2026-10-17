import { useCurrentStep } from '@/store'
import { Terminal } from 'lucide-react'

export function ConsolePanel() {
  const step = useCurrentStep()
  const output = step?.consoleOutput ?? ''
  const lines = output ? output.split('\n') : []

  return (
    <div className="panel overflow-hidden flex flex-col h-full">
      <div className="panel-header">
        <Terminal size={14} className="text-green-400" />
        Console Output
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        {lines.length === 0 ? (
          <p className="text-gray-600 text-sm italic">No output yet</p>
        ) : (
          <pre className="font-mono text-sm text-green-300 whitespace-pre-wrap leading-relaxed">
            {lines.map((line, i) => (
              <span key={i} className="block">
                {line || ' '}
              </span>
            ))}
          </pre>
        )}
      </div>
    </div>
  )
}
