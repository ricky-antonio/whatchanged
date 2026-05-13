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
    <header className="h-12 flex items-center px-4 gap-4 shrink-0 border-b border-border bg-card">
      {/* gradient title */}
      <span className="font-black text-base tracking-tight bg-gradient-to-r from-violet-500 to-cyan-400 bg-clip-text text-transparent select-none">
        diff
      </span>

      {/* mode toggle — centered */}
      <div className="flex-1 flex justify-center">
        <ToggleGroup
          value={[mode]}
          onValueChange={(values) => {
            const next = values[0] as DiffMode | undefined
            if (next) onModeChange(next)
          }}
          className="h-7 rounded-full p-0.5 bg-muted border border-border gap-0"
        >
          <ToggleGroupItem
            value="line"
            aria-label="Line diff mode"
            className="h-6 px-4 text-xs rounded-full font-medium transition-all duration-150
              text-muted-foreground
              data-[pressed]:bg-gradient-to-r data-[pressed]:from-violet-600 data-[pressed]:to-violet-500
              data-[pressed]:text-white data-[pressed]:shadow-sm"
          >
            Line
          </ToggleGroupItem>
          <ToggleGroupItem
            value="word"
            aria-label="Word diff mode"
            className="h-6 px-4 text-xs rounded-full font-medium transition-all duration-150
              text-muted-foreground
              data-[pressed]:bg-gradient-to-r data-[pressed]:from-violet-600 data-[pressed]:to-violet-500
              data-[pressed]:text-white data-[pressed]:shadow-sm"
          >
            Word
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* right controls */}
      <div className="flex items-center gap-2">
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
