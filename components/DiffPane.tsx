import { forwardRef } from 'react'
import { DiffLine } from './DiffLine'
import { EmptyState } from './EmptyState'
import type { DiffLine as DiffLineType, DiffMode } from '@/lib/types'

interface Props {
  label?: string
  lines: DiffLineType[]
  mode: DiffMode
  onScroll: React.UIEventHandler<HTMLDivElement>
}

export const DiffPane = forwardRef<HTMLDivElement, Props>(function DiffPane(
  { label, lines, mode, onScroll },
  ref,
) {
  return (
    <div className="flex flex-col flex-[3] min-h-0 min-w-0">
      {label && (
        <div className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 border-b border-border bg-card shrink-0">
          {label}
        </div>
      )}
      <div
        ref={ref}
        onScroll={onScroll}
        className="flex-1 overflow-auto bg-background min-h-0"
      >
        {lines.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="py-1">
            {lines.map((line, i) => (
              <DiffLine key={i} line={line} mode={mode} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
})
