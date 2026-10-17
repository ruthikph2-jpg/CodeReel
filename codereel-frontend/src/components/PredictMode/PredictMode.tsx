import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Check, X, Trophy } from 'lucide-react'
import { useCurrentStep } from '@/store'

export function PredictMode() {
  const step = useCurrentStep()
  const [guesses, setGuesses] = useState<Record<string, string>>({})
  const [revealed, setRevealed] = useState(false)
  const [score, setScore] = useState(0)
  const [total, setTotal] = useState(0)

  const variables = step?.variables ?? []
  const predictableVars = variables.filter((v) => v.changed)

  const handleReveal = () => {
    let correct = 0
    predictableVars.forEach((v) => {
      const guess = guesses[v.name]?.trim().toLowerCase()
      const actual = String(v.value).toLowerCase()
      if (guess === actual) correct++
    })
    setScore((s) => s + correct)
    setTotal((t) => t + predictableVars.length)
    setRevealed(true)
  }

  const handleNext = () => {
    setGuesses({})
    setRevealed(false)
  }

  if (predictableVars.length === 0) {
    return (
      <div className="panel p-6 text-center">
        <Brain size={32} className="text-brand-400 mx-auto mb-3" />
        <p className="text-gray-400 text-sm">
          Predict Mode activates when a variable changes.
          Step through code to make predictions!
        </p>
        <div className="mt-3 text-xs text-gray-600">
          Score: {score}/{total}
        </div>
      </div>
    )
  }

  return (
    <div className="panel p-4">
      <div className="panel-header border-0 p-0 mb-4">
        <Brain size={14} className="text-brand-400" />
        Predict Mode
        <span className="ml-auto badge bg-brand-500/20 text-brand-400">
          <Trophy size={10} className="mr-1" /> {score}/{total}
        </span>
      </div>

      <p className="text-xs text-gray-500 mb-4">
        What will these variables become after this step?
      </p>

      <div className="flex flex-col gap-3">
        {predictableVars.map((v) => {
          const guess = guesses[v.name] ?? ''
          const actual = String(v.value)
          const isCorrect = revealed && guess.trim().toLowerCase() === actual.toLowerCase()
          const isWrong = revealed && !isCorrect

          return (
            <div key={v.name} className="flex items-center gap-3">
              <span className="text-gray-300 font-mono text-sm w-24 truncate">{v.name}</span>
              <span className="text-gray-500 text-xs">→</span>
              <input
                type="text"
                placeholder="your guess"
                value={guess}
                disabled={revealed}
                onChange={(e) => setGuesses((g) => ({ ...g, [v.name]: e.target.value }))}
                className="flex-1 bg-surface-700 border border-surface-500 rounded-lg px-3 py-1.5
                           text-sm font-mono text-white focus:outline-none focus:border-brand-500
                           disabled:opacity-60"
              />
              <AnimatePresence>
                {revealed && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-1"
                  >
                    {isCorrect ? (
                      <Check size={16} className="text-green-400" />
                    ) : (
                      <>
                        <X size={16} className="text-red-400" />
                        <span className="text-xs font-mono text-green-400">{actual}</span>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>

      <div className="mt-4 flex gap-2">
        {!revealed ? (
          <button onClick={handleReveal} className="btn-primary text-xs flex-1">
            <Brain size={12} /> Reveal Answers
          </button>
        ) : (
          <button onClick={handleNext} className="btn-ghost border border-surface-600 text-xs flex-1">
            Next Step →
          </button>
        )}
      </div>
    </div>
  )
}
