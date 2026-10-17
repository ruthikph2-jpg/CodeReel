import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react'
import { CodeEditor } from '@/components/Editor/CodeEditor'
import { getSharedSnippet } from '@/api'
import type { Snippet } from '@/types'

export function SharedSnippetPage() {
  const { token } = useParams<{ token: string }>()
  const [snippet, setSnippet] = useState<Snippet | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) return
    getSharedSnippet(token)
      .then(setSnippet)
      .catch(() => setError('Snippet not found or link expired.'))
      .finally(() => setLoading(false))
  }, [token])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="animate-spin text-brand-400" size={32} />
    </div>
  )

  if (error || !snippet) return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <AlertCircle className="text-red-400" size={32} />
      <p className="text-gray-400">{error}</p>
      <Link to="/workspace" className="btn-ghost">
        <ArrowLeft size={14} /> Back to Workspace
      </Link>
    </div>
  )

  return (
    <div className="flex flex-col p-6 gap-4 max-w-4xl mx-auto w-full">
      <div className="flex items-center gap-3">
        <Link to="/workspace" className="btn-ghost">
          <ArrowLeft size={14} /> Back
        </Link>
        <div>
          <h1 className="text-xl font-bold">{snippet.title}</h1>
          {snippet.author && (
            <p className="text-sm text-gray-500">by {snippet.author}</p>
          )}
        </div>
      </div>
      <div className="panel h-[500px] overflow-hidden">
        <CodeEditor value={snippet.code} readOnly />
      </div>
    </div>
  )
}
