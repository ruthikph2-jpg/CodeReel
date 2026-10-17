import { motion, AnimatePresence } from 'framer-motion'
import { useCurrentStep } from '@/store'
import { AlignJustify } from 'lucide-react'
import type { StackSnapshot } from '@/types'

export function StackViz() {
  const step = useCurrentStep()
  const stacks: StackSnapshot[] = step?.dataStructures?.stacks ?? []

  if (stacks.length === 0) return null

  return (
    <div className="panel overflow-hidden">
      <div className="panel-header">
        <AlignJustify size={14} className="text-emerald-400" />
        Stacks
      </div>
      <div className="p-4 flex gap-8 flex-wrap">
        {stacks.map((stack) => (
          <div key={stack.name} className="flex flex-col items-center gap-1">
            <div className="text-xs text-gray-500 mb-2 font-mono">{stack.name}</div>
            {/* Top indicator */}
            <div className="text-[10px] text-emerald-400 mb-1 font-medium">
              {stack.elements.length > 0 ? '⬆ TOP' : 'EMPTY'}
            </div>
            <div className="flex flex-col-reverse gap-1 min-h-12">
              <AnimatePresence mode="popLayout">
                {stack.elements.map((el, i) => (
                  <motion.div
                    key={`${stack.name}-${i}-${el}`}
                    initial={{ opacity: 0, x: -20, height: 0 }}
                    animate={{ opacity: 1, x: 0, height: 'auto' }}
                    exit={{ opacity: 0, x: 20, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`viz-cell w-20 text-white border-2 ${
                      i === stack.elements.length - 1
                        ? 'border-emerald-500 bg-emerald-500/10'
                        : 'border-surface-500'
                    }`}
                  >
                    {el === null ? '∅' : String(el)}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            {/* Base */}
            <div className="w-20 h-1 bg-emerald-600/60 rounded-full mt-1" />
          </div>
        ))}
      </div>
    </div>
  )
}
