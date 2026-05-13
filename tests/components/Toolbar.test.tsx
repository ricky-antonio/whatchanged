import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Toolbar } from '@/components/Toolbar'
import type { DiffResult } from '@/lib/types'

// next-themes useTheme needs a provider; stub it for unit tests
vi.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'light', setTheme: vi.fn() }),
}))

const noop = () => {}

const mockResult: DiffResult = {
  leftLines: [],
  rightLines: [],
  addedCount: 12,
  removedCount: 4,
}

describe('Toolbar', () => {
  it('stats badge shows correct counts after diff', () => {
    render(
      <Toolbar mode="word" onModeChange={noop} diffResult={mockResult} onClear={noop} />,
    )
    expect(screen.getByText('+12')).toBeDefined()
    expect(screen.getByText('−4')).toBeDefined()
  })

  it('stats badge is not shown when diffResult is null', () => {
    render(
      <Toolbar mode="word" onModeChange={noop} diffResult={null} onClear={noop} />,
    )
    expect(screen.queryByText('+0')).toBeNull()
  })

  it('dark mode button is present with aria-label', () => {
    render(
      <Toolbar mode="word" onModeChange={noop} diffResult={null} onClear={noop} />,
    )
    expect(screen.getByLabelText('Toggle dark mode')).toBeDefined()
  })

  it('mode toggle items are present', () => {
    render(
      <Toolbar mode="line" onModeChange={noop} diffResult={null} onClear={noop} />,
    )
    expect(screen.getByLabelText('Line diff mode')).toBeDefined()
    expect(screen.getByLabelText('Word diff mode')).toBeDefined()
  })
})
