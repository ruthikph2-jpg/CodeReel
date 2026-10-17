import { motion, AnimatePresence } from 'framer-motion'
import { useCurrentStep } from '@/store'
import type { StackSnapshot } from '@/types'
import { clsx } from 'clsx'

const BLOCK_COLORS = [
  'from-emerald-500 to-emerald-700 border-emerald-400',
  'from-teal-500 to-teal-700 border-teal-400',
  'from-cyan-500 to-cyan-700 border-cyan-400',
  'from-green-500 to-green-700 border-green-400',
  'from-lime-500 to-lime-700 border-lime-400',
  'from-emerald-400 to-emerald-600 border-emerald-300',
]

export function StackViz() {
  const step = useCurrentStep()
  const stacks: StackSnapshot[] = step?.dataStructures?.stacks ?? []
  if (stacks.length === 0) return null

  return (
    <div className="panel overflow-hidden">
      <div className="panel-header">
        <span className="text-lg">📚</span>
        <span className="font-bold">Stack</span>
        <span className="ml-2 text-xs text-gray-500 font-normal">— LIFO: Last In, First Out</span>
      </div>

      <div className="p-5 flex gap-12 flex-wrap">
        {stacks.map((stack) => (
          <div key={stack.name} className="flex flex-col items-center">
            <div className="text-xs text-emerald-400 font-mono font-bold mb-4">{stack.name}</div>

            {/* Stack container — like a test tube / box */}
            <div className="relative flex flex-col items-center">

              {/* TOP label with bouncing arrow */}
              <div className="mb-2 flex flex-col items-center">
                {stack.elements.length > 0 ? (
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
                    className="text-emerald-400 text-xs font-bold flex flex-col items-center gap-0.5"
                  >
                    <span>TOP</span>
                    <span>▼</span>
                  </motion.div>
                ) : (
                  <span className="text-gray-600 text-xs italic">empty</span>
                )}
              </div>

              {/* Stack walls (left + right borders) */}
              <div className="relative w-24 flex flex-col-reverse gap-1.5 min-h-[60px]">
                {/* Left wall */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-slate-500 to-slate-600 rounded-l" />
                {/* Right wall */}
                <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-slate-500 to-slate-600 rounded-r" />

                <AnimatePresence mode="popLayout">
                  {stack.elements.map((el, i) => {
                    const isTop = i === stack.elements.length - 1
                    const colorClass = BLOCK_COLORS[i % BLOCK_COLORS.length]
                    return (
                      <motion.div
                        key={`${stack.name}-${i}-${el}`}
                        layout
                        initial={{ y: -80, opacity: 0, scale: 0.7 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ x: 80, opacity: 0, scale: 0.7, rotate: 15 }}
                        transition={{
                          type: 'spring',
                          stiffness: 260,
                          damping: 20,
                        }}
                        className={clsx(
                          'mx-1 h-11 rounded-lg flex items-center justify-center',
                          'font-mono font-bold text-white text-sm border-2 relative shadow-lg',
                          `bg-gradient-to-br ${colorClass}`,
                          isTop && 'ring-2 ring-white/30'
                        )}
                      >
                        {/* Block shine */}
                        <div className="absolute top-0.5 left-1 right-1 h-2.5 bg-white/20 rounded" />
                        {el === null ? '∅' : String(el)}
                        {isTop && (
                          <div className="absolute -right-2 top-1/2 -translate-y-1/2 text-[8px] text-emerald-300 font-bold">
                            ◄ TOP
                          </div>
                        )}
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>

              {/* Ground / base plate */}
              <div className="w-28 h-3 bg-gradient-to-r from-slate-500 via-slate-400 to-slate-500 rounded-b-xl shadow-xl mt-0.5" />
              <div className="w-20 h-1 bg-slate-700 rounded-full mt-0.5 shadow" />

              {/* Size counter */}
              <div className="mt-3 text-xs text-gray-500 font-mono">
                size: <span className="text-emerald-400 font-bold">{stack.elements.length}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
