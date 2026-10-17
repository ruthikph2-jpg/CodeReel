import { motion, AnimatePresence } from 'framer-motion'
import { useCurrentStep } from '@/store'
import { Layers } from 'lucide-react'
import type { ArraySnapshot } from '@/types'
import { clsx } from 'clsx'

export function ArrayViz() {
  const step = useCurrentStep()
  const arrays: ArraySnapshot[] = step?.dataStructures?.arrays ?? []

  if (arrays.length === 0) return null

  return (
    <div className="panel overflow-hidden">
      <div className="panel-header">
        <Layers size={14} className="text-brand-400" />
        Arrays
      </div>
      <div className="p-4 flex flex-col gap-6">
        {arrays.map((arr) => (
          <div key={arr.name}>
            <div className="text-xs text-gray-500 mb-2 font-mono">{arr.name}</div>
            <div className="flex flex-wrap gap-2">
              {arr.elements.map((el, i) => (
                <motion.div
                  key={i}
                  layout
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.25, delay: i * 0.03 }}
                  className="flex flex-col items-center gap-1"
                >
                  <motion.div
                    animate={{
                      borderColor: i === arr.highlightIndex ? '#3b5bfc' : '#2e3850',
                      backgroundColor: i === arr.highlightIndex ? 'rgba(59,91,252,0.15)' : 'transparent',
                      scale: i === arr.highlightIndex ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                    className={clsx(
                      'viz-cell border-surface-500 text-white',
                      i === arr.highlightIndex && 'ring-2 ring-brand-500/50'
                    )}
                  >
                    {el === null ? <span className="text-gray-600">∅</span> : String(el)}
                  </motion.div>
                  <span className="text-[10px] text-gray-600 font-mono">[{i}]</span>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
