'use client'

import { useRef, useState } from 'react'
import { Toolbar } from '@/components/Toolbar'
import { EditorPane } from '@/components/EditorPane'
import { DiffPane } from '@/components/DiffPane'
import { computeDiff } from '@/lib/diff'
import type { DiffMode, DiffResult } from '@/lib/types'

const SAMPLE_ORIGINAL = `The quick brown fox jumps over the lazy dog.
It was a bright cold day in April.
All happy families are alike.
To be or not to be, that is the question.
The only way to do great work is to love what you do.`

const SAMPLE_CHANGED = `The quick brown fox leaps over the lazy cat.
It was a bright cold day in November.
All happy families are alike.
To be or not to be, that is the answer.
The only way to do great work is to enjoy what you do.`

export default function Home() {
  const [original, setOriginal] = useState('')
  const [changed, setChanged] = useState('')
  const [mode, setMode] = useState<DiffMode>('word')
  const [diffResult, setDiffResult] = useState<DiffResult | null>(null)
  const [viewMode, setViewMode] = useState<'edit' | 'diff'>('edit')

  const leftRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)
  const isSyncing = useRef(false)

  function handleCompare() {
    const result = computeDiff(original, changed, mode)
    setDiffResult(result)
    setViewMode('diff')
  }

  function handleClear() {
    setOriginal('')
    setChanged('')
    setDiffResult(null)
    setViewMode('edit')
  }

  function handleModeChange(newMode: DiffMode) {
    setMode(newMode)
    if (diffResult) {
      setDiffResult(computeDiff(original, changed, newMode))
    }
  }

  function handleLeftScroll() {
    if (isSyncing.current || !rightRef.current || !leftRef.current) return
    isSyncing.current = true
    rightRef.current.scrollTop = leftRef.current.scrollTop
    isSyncing.current = false
  }

  function handleRightScroll() {
    if (isSyncing.current || !leftRef.current || !rightRef.current) return
    isSyncing.current = true
    leftRef.current.scrollTop = rightRef.current.scrollTop
    isSyncing.current = false
  }

  return (
    <div className="flex flex-col h-full">
      <Toolbar
        mode={mode}
        onModeChange={handleModeChange}
        diffResult={diffResult}
        onCompare={handleCompare}
        onClear={handleClear}
      />

      <main className="flex-1 flex flex-col md:flex-row gap-2 p-2 min-h-0">
        {viewMode === 'edit' ? (
          <>
            <EditorPane
              label="Original"
              value={original}
              placeholder="Paste original text here…"
              onChange={setOriginal}
              onSample={() => setOriginal(SAMPLE_ORIGINAL)}
            />
            <div className="hidden md:block w-px bg-border shrink-0" />
            <EditorPane
              label="Changed"
              value={changed}
              placeholder="Paste changed text here…"
              onChange={setChanged}
              onSample={() => setChanged(SAMPLE_CHANGED)}
            />
          </>
        ) : (
          <>
            <DiffPane
              ref={leftRef}
              label="Original"
              lines={diffResult?.leftLines ?? []}
              mode={mode}
              onScroll={handleLeftScroll}
            />
            <div className="hidden md:block w-px bg-border shrink-0" />
            <DiffPane
              ref={rightRef}
              label="Changed"
              lines={diffResult?.rightLines ?? []}
              mode={mode}
              onScroll={handleRightScroll}
            />
          </>
        )}
      </main>

      {viewMode === 'diff' && (
        <div className="shrink-0 px-4 py-2 border-t border-border text-xs text-muted-foreground flex justify-end">
          <button
            onClick={() => setViewMode('edit')}
            className="hover:text-foreground transition-colors"
          >
            ← Edit
          </button>
        </div>
      )}
    </div>
  )
}
