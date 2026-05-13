import type { DiffLine as DiffLineType, DiffMode } from '@/lib/types'

interface Props {
  line: DiffLineType
  mode: DiffMode
}

const lineClass: Record<string, string> = {
  added: 'bg-[var(--diff-add-bg)] text-[var(--diff-add-text)]',
  removed: 'bg-[var(--diff-remove-bg)] text-[var(--diff-remove-text)]',
  unchanged: '',
  placeholder: 'opacity-0 pointer-events-none',
}

const wordClass: Record<string, string> = {
  added: 'bg-[var(--diff-add-word-bg)]',
  removed: 'bg-[var(--diff-remove-word-bg)]',
  unchanged: '',
}

export function DiffLine({ line, mode }: Props) {
  const showWordHighlights = mode === 'word' && line.words && line.words.length > 0

  return (
    <div className={`flex min-h-[1.5rem] leading-6 ${lineClass[line.type]}`}>
      {/* gutter */}
      <span className="w-10 shrink-0 select-none text-right pr-3 text-muted-foreground border-r border-border text-xs leading-6">
        {line.lineNumber ?? ''}
      </span>
      {/* content */}
      <span className="px-3 font-mono text-sm whitespace-pre-wrap break-all flex-1">
        {showWordHighlights
          ? line.words!.map((chunk, i) => (
              <span key={i} className={wordClass[chunk.type]}>
                {chunk.text}
              </span>
            ))
          : line.text}
      </span>
    </div>
  )
}
