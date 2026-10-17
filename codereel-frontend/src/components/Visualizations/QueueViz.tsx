import { motion, AnimatePresence } from 'framer-motion'
import { useCurrentStep } from '@/store'
import { ArrowRight, MoveRight } from 'lucide-react'
import type { QueueSnapshot } from '@/types'

export function QueueViz() {
  const step = useCurrentStep()
  const queues: QueueSnapshot[] = step?.dataStructures?.queues ?? []

  if (queues.length === 0) return null

  return (
    <div className="panel overflow-hidden">
      <div className="panel-header">
        <MoveRight size={14} className="text-amber-400" />
        Queues
      </div>
      <div className="p-4 flex flex-col gap-6">
        {queues.map((queue) => (
          <div key={queue.name}>
            <div className="text-xs text-gray-500 mb-2 font-mono">{queue.name}</div>
            <div className="flex items-center gap-2">
              {/* Enqueue indicator */}
              <div className="text-[10px] text-amber-400 font-medium rotate-90 shrink-0">⬇ IN</div>
              <div className="flex items-center gap-1 overflow-x-auto py-1">
                <AnimatePresence mode="popLayout" initial={false}>
                  {queue.elements.map((el, i) => (
                    <motion.div
                      key={`${queue.name}-${i}-${el}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8, x: 20 }}
                      transition={{ duration: 0.25 }}
                      className={`viz-cell shrink-0 text-white border-2 ${
                        i === 0
                          ? 'border-amber-500 bg-amber-500/10'
                          : 'border-surface-500'
                      }`}
                    >
                      {el === null ? '∅' : String(el)}
                    </motion.div>
                  ))}
                  {queue.elements.length === 0 && (
                    <span className="text-gray-600 text-sm italic">empty</span>
                  )}
                </AnimatePresence>
              </div>
              <ArrowRight size={14} className="text-amber-400 shrink-0" />
              <div className="text-[10px] text-amber-400 font-medium shrink-0">OUT ⬆</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
