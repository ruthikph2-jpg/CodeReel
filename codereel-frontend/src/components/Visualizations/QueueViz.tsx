import { motion, AnimatePresence } from 'framer-motion'
import { useCurrentStep } from '@/store'
import type { QueueSnapshot } from '@/types'
import { clsx } from 'clsx'

const ITEM_COLORS = [
  'from-amber-500 to-orange-600 border-amber-400',
  'from-orange-400 to-red-500 border-orange-300',
  'from-yellow-500 to-amber-600 border-yellow-400',
  'from-amber-400 to-yellow-500 border-amber-300',
  'from-orange-500 to-amber-600 border-orange-400',
]

export function QueueViz() {
  const step = useCurrentStep()
  const queues: QueueSnapshot[] = step?.dataStructures?.queues ?? []
  if (queues.length === 0) return null

  return (
    <div className="panel overflow-hidden">
      <div className="panel-header">
        <span className="text-lg">🚶</span>
        <span className="font-bold">Queue</span>
        <span className="ml-2 text-xs text-gray-500 font-normal">— FIFO: First In, First Out</span>
      </div>

      <div className="p-5 flex flex-col gap-8">
        {queues.map((queue) => (
          <div key={queue.name}>
            <div className="text-xs text-amber-400 font-mono font-bold mb-4">{queue.name}</div>

            <div className="flex items-center gap-3">
              {/* ENQUEUE side */}
              <div className="flex flex-col items-center gap-1 shrink-0">
                <motion.div
                  animate={{ x: [0, 6, 0] }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                  className="text-amber-400 text-lg"
                >
                  →
                </motion.div>
                <span className="text-[9px] text-amber-500 font-bold">ENQUEUE</span>
              </div>

              {/* Queue tube / conveyor */}
              <div className="flex-1 relative">
                {/* Top rail */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-slate-600 to-slate-500 rounded" />
                {/* Bottom rail */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-slate-500 to-slate-600 rounded" />

                {/* Items on conveyor */}
                <div className="flex items-center gap-2 py-2 px-2 min-h-[60px] overflow-x-auto">
                  <AnimatePresence mode="popLayout" initial={false}>
                    {queue.elements.length === 0 ? (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-gray-600 text-sm italic mx-auto"
                      >
                        empty queue
                      </motion.span>
                    ) : (
                      queue.elements.map((el, i) => {
                        const isFirst = i === 0
                        const isLast = i === queue.elements.length - 1
                        const colorClass = ITEM_COLORS[i % ITEM_COLORS.length]
                        return (
                          <motion.div
                            key={`${queue.name}-${i}-${el}`}
                            layout
                            initial={{ x: 60, opacity: 0, scale: 0.5 }}
                            animate={{ x: 0, opacity: 1, scale: 1 }}
                            exit={{ x: -60, opacity: 0, scale: 0.5, rotate: -10 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                            className="relative shrink-0"
                          >
                            {/* Person/item block */}
                            <div className={clsx(
                              'w-12 h-10 rounded-lg flex flex-col items-center justify-center',
                              'border-2 font-mono font-bold text-white text-sm shadow-lg relative',
                              `bg-gradient-to-br ${colorClass}`,
                              isFirst && 'ring-2 ring-white/40'
                            )}>
                              {/* Shine */}
                              <div className="absolute top-0.5 left-1 right-1 h-2 bg-white/20 rounded" />
                              <span>{el === null ? '∅' : String(el)}</span>
                            </div>

                            {/* Labels */}
                            {isFirst && (
                              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[8px] text-green-400 font-bold whitespace-nowrap">
                                FRONT
                              </div>
                            )}
                            {isLast && queue.elements.length > 1 && (
                              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[8px] text-amber-400 font-bold whitespace-nowrap">
                                REAR
                              </div>
                            )}
                          </motion.div>
                        )
                      })
                    )}
                  </AnimatePresence>
                </div>

                {/* Conveyor belt dots */}
                <div className="flex gap-3 px-4 mt-1">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-slate-600"
                      animate={{ x: [-4, 4, -4] }}
                      transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.18 }}
                    />
                  ))}
                </div>
              </div>

              {/* DEQUEUE side */}
              <div className="flex flex-col items-center gap-1 shrink-0">
                <motion.div
                  animate={{ x: [0, 6, 0] }}
                  transition={{ repeat: Infinity, duration: 1.2, delay: 0.3 }}
                  className="text-green-400 text-lg"
                >
                  →
                </motion.div>
                <span className="text-[9px] text-green-500 font-bold">DEQUEUE</span>
              </div>
            </div>

            <div className="mt-5 text-xs text-gray-500 font-mono">
              size: <span className="text-amber-400 font-bold">{queue.elements.length}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
