import { motion, AnimatePresence } from 'framer-motion'
import { useCurrentStep } from '@/store'
import { Variable as VariableIcon, TrendingUp } from 'lucide-react'
import { clsx } from 'clsx'

export function VariablePanel() {
  const step = useCurrentStep()
  const variables = step?.variables ?? []

  return (
    <div className="panel overflow-hidden flex flex-col h-full">
      <div className="panel-header">
        <VariableIcon size={14} className="text-cyan-400" />
        Variables
        <span className="ml-auto badge bg-surface-600 text-gray-400">{variables.length}</span>
      </div>
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-1">
        {variables.length === 0 && (
          <p className="text-gray-600 text-sm italic text-center py-6">No variables yet</p>
        )}
        <AnimatePresence mode="popLayout">
          {variables.map((v) => (
            <motion.div
              key={v.name}
              layout
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.2 }}
              className={clsx(
                'flex items-center justify-between px-3 py-2 rounded-lg text-sm',
                v.changed
                  ? 'bg-brand-500/15 border border-brand-500/30'
                  : 'bg-surface-700'
              )}
            >
              <div className="flex items-center gap-2 min-w-0">
                {v.changed && <TrendingUp size={12} className="text-brand-400 shrink-0" />}
                <span className="text-gray-400 font-mono text-xs shrink-0">{v.type}</span>
                <span className="text-white font-mono font-medium truncate">{v.name}</span>
              </div>
              <span className={clsx(
                'font-mono text-xs font-bold shrink-0 ml-2',
                v.changed ? 'text-brand-400' : 'text-cyan-300'
              )}>
                {v.value === null ? 'null' : String(v.value)}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
