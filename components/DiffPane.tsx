import { forwardRef } from 'react'
import { DiffLine } from './DiffLine'
import { EmptyState } from './EmptyState'
import type { DiffLine as DiffLineType, DiffMode } from '@/lib/types'

interface Props {
  label: string
  lines: DiffLineType[]
  mode: DiffMode
  onScroll: React.UIEventHandler<HTMLDivElement>
}

export const DiffPane = forwardRef<HTMLDivElement, Props>(function DiffPane(
  { label, lines, mode, onScroll },
  ref,
) {
  return (
    <div className="flex flex-col flex-1 min-w-0 border border-border rounded-md overflow-hidden">
      <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border bg-muted/30 shrink-0">
        {label}
      </div>
      <div
        ref={ref}
        onScroll={onScroll}
        className="flex-1 overflow-auto"
        style={{
          boxShadow: 'inset 0 6px 6px -6px rgba(0,0,0,0.15), inset 0 -6px 6px -6px rgba(0,0,0,0.15)',
        }}
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
