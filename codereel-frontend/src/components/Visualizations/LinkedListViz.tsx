import { motion } from 'framer-motion'
import { useCurrentStep } from '@/store'
import { GitBranch } from 'lucide-react'
import type { LinkedListSnapshot, LinkedListNode } from '@/types'

export function LinkedListViz() {
  const step = useCurrentStep()
  const lists: LinkedListSnapshot[] = step?.dataStructures?.linkedLists ?? []

  if (lists.length === 0) return null

  return (
    <div className="panel overflow-hidden">
      <div className="panel-header">
        <GitBranch size={14} className="text-violet-400" />
        Linked Lists
      </div>
      <div className="p-4 flex flex-col gap-6">
        {lists.map((list) => (
          <div key={list.name}>
            <div className="text-xs text-gray-500 mb-3 font-mono">{list.name}</div>
            <div className="flex items-center gap-1 overflow-x-auto pb-1">
              {/* HEAD label */}
              <div className="text-[10px] text-violet-400 font-bold mr-1">HEAD</div>
              {list.nodes.length === 0 ? (
                <span className="text-gray-600 text-sm italic">null</span>
              ) : (
                <>
                  {list.nodes.map((node, i) => (
                    <NodeBlock key={node.id} node={node} isHead={node.id === list.headId} isLast={i === list.nodes.length - 1} />
                  ))}
                  {/* NULL terminator */}
                  <span className="text-gray-600 text-xs font-mono ml-1">null</span>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function NodeBlock({ node, isHead, isLast }: { node: LinkedListNode; isHead: boolean; isLast: boolean }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center gap-0.5 shrink-0"
    >
      {/* Node box: value | next ptr */}
      <div className={`flex border-2 rounded-lg overflow-hidden ${isHead ? 'border-violet-500' : 'border-surface-500'}`}>
        <div className={`px-3 py-2 text-sm font-mono font-bold text-white ${isHead ? 'bg-violet-500/15' : ''}`}>
          {node.value === null ? '∅' : String(node.value)}
        </div>
        <div className="w-px bg-surface-500" />
        <div className="px-2 py-2 text-[10px] text-gray-500 font-mono flex items-center">
          {isLast ? 'null' : '→'}
        </div>
      </div>
      {/* Arrow to next */}
      {!isLast && (
        <svg width="24" height="16" viewBox="0 0 24 16" className="text-violet-400">
          <path d="M2 8 H20 M16 4 L22 8 L16 12" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      )}
    </motion.div>
  )
}
