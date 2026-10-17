import { useEffect, useRef, useCallback } from 'react'
import { useStore } from '@/store'
import { executeCode } from '@/api'
import { mockExecuteCode } from '@/api/mockExecute'
import toast from 'react-hot-toast'

export function useExecution() {
  const { code, isLoading, setTrace, setLoading, setError } = useStore()

  const run = useCallback(async () => {
    if (isLoading) return
    setLoading(true)
    setError(null)
    try {
      // Try real backend first; fall back to mock demo mode if backend is offline
      let result
      try {
        result = await executeCode({ code, language: 'java' })
      } catch {
        console.warn('Backend unavailable — switching to demo mode')
        result = await mockExecuteCode(code)
        toast('Running in demo mode 🎭 (backend offline)', { icon: '🎭' })
      }
      setTrace(result.trace)
      if (result.trace.hasError) {
        toast.error('Execution error — check the console panel')
      } else {
        toast.success(`Traced ${result.trace.totalSteps} steps!`)
      }
    } catch (err: any) {
      const msg = err?.message ?? 'Execution failed'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }, [code, isLoading, setTrace, setLoading, setError])

  return { run, isLoading }
}

export function useAutoplay() {
  const { player, stepForward, setPlaying } = useStore()
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (player.isPlaying) {
      const delay = 1000 / player.speed
      intervalRef.current = setInterval(() => {
        const { currentStep, totalSteps } = useStore.getState().player
        if (currentStep >= totalSteps - 1) {
          setPlaying(false)
        } else {
          stepForward()
        }
      }, delay)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [player.isPlaying, player.speed, stepForward, setPlaying])
}
