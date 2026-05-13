import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { DiffPane } from '@/components/DiffPane'
import type { DiffLine } from '@/lib/types'

const noop = () => {}

function makeLines(...overrides: Partial<DiffLine>[]): DiffLine[] {
  return overrides.map((o, i) => ({
    lineNumber: i + 1,
    type: 'unchanged' as const,
    text: `line ${i + 1}`,
    ...o,
  }))
}

describe('DiffPane', () => {
  it('renders line numbers in the gutter', () => {
    const lines = makeLines({ lineNumber: 1, text: 'hello' }, { lineNumber: 2, text: 'world' })
    render(<DiffPane label="Original" lines={lines} mode="line" onScroll={noop} />)
    expect(screen.getByText('1')).toBeDefined()
    expect(screen.getByText('2')).toBeDefined()
  })

  it('added lines have added bg class', () => {
    const lines = makeLines({ type: 'added', text: 'new line' })
    const { container } = render(
      <DiffPane label="Changed" lines={lines} mode="line" onScroll={noop} />,
    )
    const addedRow = container.querySelector('.bg-\\[var\\(--diff-add-bg\\)\\]')
    expect(addedRow).toBeTruthy()
  })

  it('removed lines have removed bg class', () => {
    const lines = makeLines({ type: 'removed', text: 'old line' })
    const { container } = render(
      <DiffPane label="Original" lines={lines} mode="line" onScroll={noop} />,
    )
    const removedRow = container.querySelector('.bg-\\[var\\(--diff-remove-bg\\)\\]')
    expect(removedRow).toBeTruthy()
  })

  it('placeholder lines render as blank with no line number', () => {
    const lines = makeLines({ lineNumber: null, type: 'placeholder', text: '' })
    render(<DiffPane label="Original" lines={lines} mode="line" onScroll={noop} />)
    // line number gutter should be empty (no numeric text)
    expect(screen.queryByText('1')).toBeNull()
  })

  it('word chunks render inline in word mode', () => {
    const lines = makeLines({
      type: 'added',
      text: 'hello world',
      words: [
        { text: 'hello ', type: 'unchanged' },
        { text: 'world', type: 'added' },
      ],
    })
    render(<DiffPane label="Changed" lines={lines} mode="word" onScroll={noop} />)
    expect(screen.getByText('hello ', { normalizer: (s) => s })).toBeDefined()
    expect(screen.getByText('world')).toBeDefined()
  })

  it('word chunks are not rendered in line mode', () => {
    const lines = makeLines({
      type: 'added',
      text: 'hello world',
      words: [
        { text: 'hello ', type: 'unchanged' },
        { text: 'world', type: 'added' },
      ],
    })
    render(<DiffPane label="Changed" lines={lines} mode="line" onScroll={noop} />)
    // in line mode, full text is rendered as one node
    expect(screen.getByText('hello world')).toBeDefined()
  })

  it('shows empty state when lines array is empty', () => {
    render(<DiffPane label="Original" lines={[]} mode="line" onScroll={noop} />)
    expect(screen.getByText('No differences to display')).toBeDefined()
  })
})
