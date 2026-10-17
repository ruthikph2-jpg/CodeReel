import Editor, { type OnMount } from '@monaco-editor/react'
import { useStore } from '@/store'
import { useRef, useCallback } from 'react'

interface CodeEditorProps {
  highlightLine?: number
  readOnly?: boolean
  value?: string
  onChange?: (value: string) => void
}

export function CodeEditor({ highlightLine, readOnly = false, value, onChange }: CodeEditorProps) {
  const { code, setCode } = useStore()
  const decorationsRef = useRef<string[]>([])

  const handleMount: OnMount = useCallback(
    (editorInstance, monaco) => {
      if (highlightLine != null && highlightLine > 0) {
        decorationsRef.current = editorInstance.deltaDecorations(decorationsRef.current, [
          {
            range: new monaco.Range(highlightLine, 1, highlightLine, 1),
            options: {
              isWholeLine: true,
              className: 'current-line',
              glyphMarginClassName: 'execution-arrow',
              linesDecorationsClassName: 'execution-dot',
            },
          },
        ])
        editorInstance.revealLineInCenter(highlightLine)
      } else {
        decorationsRef.current = editorInstance.deltaDecorations(decorationsRef.current, [])
      }
    },
    [highlightLine]
  )

  return (
    <Editor
      height="100%"
      defaultLanguage="java"
      value={value ?? code}
      onChange={(v) => {
        if (onChange) onChange(v ?? '')
        else setCode(v ?? '')
      }}
      onMount={handleMount}
      theme="vs-dark"
      options={{
        fontSize: 14,
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        fontLigatures: true,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        padding: { top: 16, bottom: 16 },
        lineNumbersMinChars: 3,
        readOnly,
        glyphMargin: true,
        smoothScrolling: true,
        cursorBlinking: 'smooth',
        renderLineHighlight: 'all',
      }}
    />
  )
}
