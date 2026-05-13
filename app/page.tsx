'use client'

import { useRef, useState, useMemo } from 'react'
import { Toolbar } from '@/components/Toolbar'
import { EditorPane } from '@/components/EditorPane'
import { DiffPane } from '@/components/DiffPane'
import { computeDiff } from '@/lib/diff'
import type { DiffMode } from '@/lib/types'

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

  const leftRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)
  const isSyncing = useRef(false)

  const diffResult = useMemo(
    () => computeDiff(original, changed, mode),
    [original, changed, mode],
  )

  function handleClear() {
    setOriginal('')
    setChanged('')
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

  const hasContent = original.length > 0 || changed.length > 0

  return (
    <div className="flex flex-col h-full">
      <Toolbar
        mode={mode}
        onModeChange={setMode}
        diffResult={hasContent ? diffResult : null}
        onClear={handleClear}
      />

      <main className="flex-1 flex flex-col md:flex-row min-h-0">
        {/* Left column */}
        <div className="flex-1 flex flex-col min-w-0 min-h-0 border-b md:border-b-0 border-border">
          <EditorPane
            label="Original"
            value={original}
            placeholder="Paste original text here…"
            onChange={setOriginal}
            onSample={() => setOriginal(SAMPLE_ORIGINAL)}
          />
          <div className="h-px bg-border shrink-0" />
          <DiffPane
            ref={leftRef}
            lines={diffResult.leftLines}
            mode={mode}
            onScroll={handleLeftScroll}
          />
        </div>

        <div className="hidden md:block w-px bg-border shrink-0" />

        {/* Right column */}
        <div className="flex-1 flex flex-col min-w-0 min-h-0">
          <EditorPane
            label="Changed"
            value={changed}
            placeholder="Paste changed text here…"
            onChange={setChanged}
            onSample={() => setChanged(SAMPLE_CHANGED)}
          />
          <div className="h-px bg-border shrink-0" />
          <DiffPane
            ref={rightRef}
            lines={diffResult.rightLines}
            mode={mode}
            onScroll={handleRightScroll}
          />
        </div>
      </main>
    </div>
  )
}
