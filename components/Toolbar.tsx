'use client'

import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import type { DiffMode, DiffResult } from '@/lib/types'

interface Props {
  mode: DiffMode
  onModeChange: (mode: DiffMode) => void
  diffResult: DiffResult | null
  onCompare: () => void
  onClear: () => void
}

export function Toolbar({ mode, onModeChange, diffResult, onCompare, onClear }: Props) {
  const { theme, setTheme } = useTheme()

  return (
    <header className="h-12 flex items-center px-4 gap-4 border-b border-border bg-background shrink-0">
      {/* title */}
      <span className="font-semibold text-sm tracking-tight">Diff</span>

      {/* mode toggle — centered */}
      <div className="flex-1 flex justify-center">
        <ToggleGroup
          value={[mode]}
          onValueChange={(values) => {
            const next = values[0] as DiffMode | undefined
            if (next) onModeChange(next)
          }}
          className="h-7 rounded-full border border-border p-0.5 bg-muted"
        >
          <ToggleGroupItem
            value="line"
            className="h-6 px-3 text-xs rounded-full data-[pressed]:bg-background data-[pressed]:shadow-sm"
            aria-label="Line diff mode"
          >
            Line
          </ToggleGroupItem>
          <ToggleGroupItem
            value="word"
            className="h-6 px-3 text-xs rounded-full data-[pressed]:bg-background data-[pressed]:shadow-sm"
            aria-label="Word diff mode"
          >
            Word
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* right controls */}
      <div className="flex items-center gap-2">
        {diffResult && (
          <span
            className="text-xs font-mono px-2 py-0.5 rounded-full border border-border bg-muted select-none"
            aria-label={`${diffResult.addedCount} additions, ${diffResult.removedCount} deletions`}
          >
            <span className="text-[var(--diff-add-text)]">+{diffResult.addedCount}</span>
            {' '}
            <span className="text-[var(--diff-remove-text)]">−{diffResult.removedCount}</span>
          </span>
        )}
        <Button size="sm" className="h-7 text-xs" onClick={onCompare}>
          Compare
        </Button>
        <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={onClear}>
          Clear
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7"
          aria-label="Toggle dark mode"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>
    </header>
  )
}
