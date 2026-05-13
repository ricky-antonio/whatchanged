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
  onClear: () => void
}

export function Toolbar({ mode, onModeChange, diffResult, onClear }: Props) {
  const { theme, setTheme } = useTheme()

  return (
    <header className="grid grid-cols-[1fr_auto_1fr] items-center px-6 py-4 shrink-0 border-b border-border bg-card">
      {/* title — left */}
      <span className="font-black text-2xl tracking-tight select-none">
        <span className="text-orange-500">What</span>
        <span className="text-cyan-400">Changed</span>
      </span>

      {/* mode toggle — always true center */}
      <ToggleGroup
          value={[mode]}
          onValueChange={(values) => {
            const next = values[0] as DiffMode | undefined
            if (next) onModeChange(next)
          }}
          className="h-9 rounded-full p-1 bg-muted border border-border gap-0"
        >
          <ToggleGroupItem
            value="line"
            aria-label="Line diff mode"
            className="h-7 px-6 text-sm rounded-full font-medium
              text-muted-foreground bg-transparent
              transition-colors duration-200 ease-in-out
              data-[pressed]:bg-cyan-500 data-[pressed]:text-white data-[pressed]:shadow-md"
          >
            Line
          </ToggleGroupItem>
          <ToggleGroupItem
            value="word"
            aria-label="Word diff mode"
            className="h-7 px-6 text-sm rounded-full font-medium
              text-muted-foreground bg-transparent
              transition-colors duration-200 ease-in-out
              data-[pressed]:bg-cyan-500 data-[pressed]:text-white data-[pressed]:shadow-md"
          >
            Word
          </ToggleGroupItem>
      </ToggleGroup>

      {/* right controls — right-aligned in their column */}
      <div className="flex items-center gap-3 justify-end">
        {diffResult && (
          <span className="text-xs font-mono px-2.5 py-0.5 rounded-full select-none
            bg-muted border border-border">
            <span className="text-emerald-500 dark:text-emerald-400 font-semibold">
              +{diffResult.addedCount}
            </span>
            <span className="text-muted-foreground mx-1">·</span>
            <span className="text-rose-500 dark:text-rose-400 font-semibold">
              −{diffResult.removedCount}
            </span>
          </span>
        )}
        <Button
          size="sm"
          variant="ghost"
          className="h-7 text-xs text-muted-foreground hover:text-foreground"
          onClick={onClear}
        >
          Clear
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7 text-muted-foreground hover:text-foreground"
          aria-label="Toggle dark mode"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>
    </header>
  )
}
