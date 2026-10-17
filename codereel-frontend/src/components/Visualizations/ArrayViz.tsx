import { motion, AnimatePresence } from 'framer-motion'
import { useCurrentStep } from '@/store'
import type { ArraySnapshot } from '@/types'
import { clsx } from 'clsx'

export function ArrayViz() {
  const step = useCurrentStep()
  const arrays: ArraySnapshot[] = step?.dataStructures?.arrays ?? []
  if (arrays.length === 0) return null

  return (
    <div className="panel overflow-hidden">
      <div className="panel-header">
        <span className="text-lg">🔢</span>
        <span className="font-bold">Array</span>
        <span className="ml-2 text-xs text-gray-500 font-normal">— indexed memory cells</span>
      </div>
      <div className="p-5 flex flex-col gap-8">
        {arrays.map((arr) => (
          <div key={arr.name}>
            <div className="text-xs text-brand-400 font-mono mb-3 font-bold">
              {arr.name}[{arr.elements.length}]
            </div>

            {/* Memory shelf */}
            <div className="relative">
              {/* Shelf base */}
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-slate-600 via-slate-500 to-slate-600 rounded-full shadow-lg" />

              <div className="flex gap-2 pb-3 overflow-x-auto">
                {arr.elements.map((el, i) => {
                  const isActive = i === arr.highlightIndex
                  return (
                    <motion.div
                      key={i}
                      layout
                      initial={{ y: -40, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20, delay: i * 0.04 }}
                      className="flex flex-col items-center gap-1 shrink-0"
                    >
                      {/* Value block */}
                      <motion.div
                        animate={{
                          y: isActive ? -8 : 0,
                          scale: isActive ? 1.15 : 1,
                        }}
                        transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                        className={clsx(
                          'w-12 h-12 rounded-xl flex items-center justify-center font-mono font-bold text-sm shadow-lg',
                          'border-2 relative',
                          isActive
                            ? 'bg-gradient-to-br from-brand-400 to-brand-600 border-brand-300 text-white shadow-brand-500/40 shadow-xl'
                            : 'bg-gradient-to-br from-slate-600 to-slate-700 border-slate-500 text-slate-100'
                        )}
                      >
                        {/* Shine effect */}
                        <div className="absolute top-1 left-1 right-1 h-3 bg-white/10 rounded-lg" />
                        {el === null ? <span className="text-gray-500 text-xs">∅</span> : String(el)}
                        {isActive && (
                          <motion.div
                            className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"
                            animate={{ scale: [1, 1.4, 1] }}
                            transition={{ repeat: Infinity, duration: 1 }}
                          />
                        )}
                      </motion.div>
                      {/* Index label */}
                      <span className={clsx(
                        'text-[10px] font-mono',
                        isActive ? 'text-brand-400 font-bold' : 'text-gray-600'
                      )}>
                        [{i}]
                      </span>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            {/* Pointer arrow */}
            {arr.highlightIndex != null && (
              <motion.div
                key={arr.highlightIndex}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-xs text-brand-400 font-mono flex items-center gap-1"
              >
                <span>↑ accessing index {arr.highlightIndex}</span>
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
