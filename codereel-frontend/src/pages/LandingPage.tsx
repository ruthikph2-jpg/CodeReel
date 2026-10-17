import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Film, Play, SplitSquareHorizontal, Eye, Bug, Share2 } from 'lucide-react'

const FEATURES = [
  { icon: Play,                   title: 'Step-by-Step Execution',   desc: 'Play, pause, rewind, and step through every line of your Java code.' },
  { icon: Eye,                    title: 'Live Visualizations',       desc: 'Watch arrays, stacks, queues, and linked lists animate in real time.' },
  { icon: SplitSquareHorizontal,  title: 'TwinRun',                  desc: 'Compare two executions side by side to spot the difference instantly.' },
  { icon: Bug,                    title: 'Bug Replay',               desc: 'Rewind to the exact moment something went wrong.' },
  { icon: Share2,                 title: 'Shareable Lessons',        desc: 'Create and share interactive coding walkthroughs with a single link.' },
  { icon: Film,                   title: 'Predict Mode',             desc: "Guess the next variable value before it's revealed — active learning." },
]

export function LandingPage() {
  return (
    <div className="flex flex-col items-center px-6 py-20 gap-20">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-3xl"
      >
        <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/30 rounded-full px-4 py-1.5 text-brand-400 text-sm font-medium mb-6">
          <Film size={14} /> Interactive Java Visualizer
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          See how your code{' '}
          <span className="bg-gradient-to-r from-brand-400 to-violet-400 bg-clip-text text-transparent">
            actually runs
          </span>
        </h1>
        <p className="text-gray-400 text-xl mb-10 leading-relaxed">
          CodeReel turns Java execution into animated, replayable visualizations.
          Watch every variable change, every stack frame, every data-structure operation — live.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/workspace" className="btn-primary text-base px-6 py-3">
            <Play size={18} /> Launch Workspace
          </Link>
          <Link to="/twinrun" className="btn-ghost border border-surface-600 text-base px-6 py-3">
            <SplitSquareHorizontal size={18} /> Try TwinRun
          </Link>
        </div>
      </motion.div>

      {/* Feature grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        {FEATURES.map(({ icon: Icon, title, desc }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="panel p-6 hover:border-brand-500/40 transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-brand-500/10 flex items-center justify-center mb-4">
              <Icon className="text-brand-400" size={20} />
            </div>
            <h3 className="font-semibold text-white mb-2">{title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
