import axios from 'axios'
import type { CodeRequest, ExecutionResult, Snippet } from '@/types'

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

// ─── Interceptors ─────────────────────────────────────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('codereel_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('codereel_token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// ─── Code Execution ───────────────────────────────────────────────────────────
export const executeCode = async (request: CodeRequest): Promise<ExecutionResult> => {
  const { data } = await api.post<ExecutionResult>('/execute', request)
  return data
}

// ─── Snippets ─────────────────────────────────────────────────────────────────
export const getSnippets = async (): Promise<Snippet[]> => {
  const { data } = await api.get<Snippet[]>('/snippets')
  return data
}

export const createSnippet = async (snippet: Omit<Snippet, 'id' | 'createdAt' | 'updatedAt'>): Promise<Snippet> => {
  const { data } = await api.post<Snippet>('/snippets', snippet)
  return data
}

export const updateSnippet = async (id: string, snippet: Partial<Snippet>): Promise<Snippet> => {
  const { data } = await api.put<Snippet>(`/snippets/${id}`, snippet)
  return data
}

export const deleteSnippet = async (id: string): Promise<void> => {
  await api.delete(`/snippets/${id}`)
}

export const getSharedSnippet = async (token: string): Promise<Snippet> => {
  const { data } = await api.get<Snippet>(`/snippets/shared/${token}`)
  return data
}

export const shareSnippet = async (id: string): Promise<{ shareToken: string; shareUrl: string }> => {
  const { data } = await api.post(`/snippets/${id}/share`)
  return data
}

export default api
