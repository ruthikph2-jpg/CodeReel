import { motion, AnimatePresence } from 'framer-motion'
import { useCurrentStep } from '@/store'
import type { LinkedListSnapshot, LinkedListNode } from '@/types'
import { clsx } from 'clsx'

const NODE_COLORS = [
  'from-violet-500 to-purple-700 border-violet-400',
  'from-purple-500 to-indigo-700 border-purple-400',
  'from-indigo-500 to-violet-700 border-indigo-400',
  'from-fuchsia-500 to-purple-700 border-fuchsia-400',
  'from-violet-400 to-purple-600 border-violet-300',
]

export function LinkedListViz() {
  const step = useCurrentStep()
  const lists: LinkedListSnapshot[] = step?.dataStructures?.linkedLists ?? []
  if (lists.length === 0) return null

  return (
    <div className="panel overflow-hidden">
      <div className="panel-header">
        <span className="text-lg">🔗</span>
        <span className="font-bold">Linked List</span>
        <span className="ml-2 text-xs text-gray-500 font-normal">— nodes connected by pointers</span>
      </div>

      <div className="p-5 flex flex-col gap-8">
        {lists.map((list) => (
          <div key={list.name}>
            <div className="text-xs text-violet-400 font-mono font-bold mb-4">{list.name}</div>

            {/* HEAD pointer */}
            <div className="flex items-start gap-2 overflow-x-auto pb-4">
              <div className="flex flex-col items-center shrink-0">
                <div className="text-[10px] text-violet-300 font-bold mb-1">HEAD</div>
                <div className="w-px h-6 bg-violet-500" />
                <div className="w-0 h-0 border-l-4 border-r-4 border-t-[6px] border-l-transparent border-r-transparent border-t-violet-500" />
              </div>

              {list.nodes.length === 0 ? (
                <div className="flex items-center h-16 text-gray-600 text-sm italic">→ null</div>
              ) : (
                <div className="flex items-center gap-0">
                  <AnimatePresence mode="popLayout" initial={false}>
                    {list.nodes.map((node, i) => (
                      <NodeBlock
                        key={node.id}
                        node={node}
                        isHead={node.id === list.headId}
                        isLast={i === list.nodes.length - 1}
                        colorClass={NODE_COLORS[i % NODE_COLORS.length]}
                        index={i}
                      />
                    ))}
                  </AnimatePresence>

                  {/* NULL terminator */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center ml-2"
                  >
                    <div className="px-3 py-2 border-2 border-dashed border-gray-600 rounded-lg text-gray-500 text-xs font-mono">
                      null
                    </div>
                  </motion.div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function NodeBlock({
  node,
  isHead,
  isLast,
  colorClass,
  index,
}: {
  node: LinkedListNode
  isHead: boolean
  isLast: boolean
  colorClass: string
  index: number
}) {
  return (
    <motion.div
      layout
      initial={{ scale: 0, opacity: 0, y: -30 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0, opacity: 0, y: 30 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22, delay: index * 0.06 }}
      className="flex items-center shrink-0"
    >
      {/* Node box */}
      <div className="flex flex-col items-center">
        {/* Node label */}
        <div className="text-[9px] text-gray-500 mb-1 font-mono">node_{index}</div>

        {/* Node container: [value | next→] */}
        <div className={clsx(
          'flex border-2 rounded-xl overflow-hidden shadow-lg relative',
          isHead ? 'ring-2 ring-white/30' : '',
          `bg-gradient-to-br ${colorClass}`
        )}>
          {/* Shine overlay */}
          <div className="absolute top-0 left-0 right-0 h-3 bg-white/15 rounded-t-xl pointer-events-none" />

          {/* Value cell */}
          <div className="px-4 py-3 text-white font-mono font-bold text-sm min-w-[44px] text-center">
            {node.value === null ? '∅' : String(node.value)}
          </div>

          {/* Divider */}
          <div className="w-px bg-white/20" />

          {/* Next pointer cell */}
          <div className="px-2 py-3 text-white/60 text-[10px] font-mono flex items-center">
            {isLast ? 'null' : 'next'}
          </div>
        </div>

        {/* Memory address label */}
        <div className="text-[8px] text-gray-600 mt-1 font-mono">
          0x{(index * 16 + 0xA000).toString(16).toUpperCase()}
        </div>
      </div>

      {/* Arrow to next node */}
      {!isLast && (
        <div className="flex items-center mx-1">
          <motion.svg
            width="40" height="20" viewBox="0 0 40 20"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: index * 0.06 + 0.1 }}
          >
            {/* Arrow line */}
            <line x1="2" y1="10" x2="30" y2="10" stroke="#7c3aed" strokeWidth="2" />
            {/* Arrowhead */}
            <polygon points="30,5 40,10 30,15" fill="#7c3aed" />
            {/* Animated dot traveling along arrow */}
            <motion.circle
              r="3" cy="10" fill="#a78bfa"
              animate={{ cx: [2, 36, 2] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'linear', delay: index * 0.3 }}
            />
          </motion.svg>
        </div>
      )}
    </motion.div>
  )
}
