import { describe, it, expect } from 'vitest'
import { computeDiff, splitIntoLines } from '@/lib/diff'

describe('splitIntoLines', () => {
  it('splits multi-line text correctly', () => {
    expect(splitIntoLines('a\nb\nc')).toEqual(['a', 'b', 'c'])
  })

  it('strips a single trailing newline', () => {
    expect(splitIntoLines('a\nb\n')).toEqual(['a', 'b'])
  })

  it('returns single empty string for empty input', () => {
    expect(splitIntoLines('')).toEqual([''])
  })
})

describe('computeDiff — alignment invariant', () => {
  it('leftLines and rightLines always have equal length', () => {
    const cases = [
      ['', ''],
      ['a', 'b'],
      ['a\nb\nc', 'x\ny'],
      ['', 'a\nb\nc'],
      ['a\nb\nc', ''],
    ]
    for (const [a, b] of cases) {
      const result = computeDiff(a, b, 'line')
      expect(result.leftLines.length).toBe(result.rightLines.length)
    }
  })
})

describe('computeDiff — identical strings', () => {
  it('returns all unchanged lines and zero counts', () => {
    const result = computeDiff('hello\nworld', 'hello\nworld', 'line')
    expect(result.addedCount).toBe(0)
    expect(result.removedCount).toBe(0)
    expect(result.leftLines.every((l) => l.type === 'unchanged')).toBe(true)
    expect(result.rightLines.every((l) => l.type === 'unchanged')).toBe(true)
  })
})

describe('computeDiff — empty inputs', () => {
  it('handles both empty without throwing', () => {
    expect(() => computeDiff('', '', 'line')).not.toThrow()
  })

  it('handles left empty', () => {
    const result = computeDiff('', 'new line', 'line')
    expect(result.addedCount).toBeGreaterThan(0)
    expect(result.removedCount).toBe(0)
  })

  it('handles right empty', () => {
    const result = computeDiff('old line', '', 'line')
    expect(result.removedCount).toBeGreaterThan(0)
    expect(result.addedCount).toBe(0)
  })
})

describe('computeDiff — single added line', () => {
  it('places added line in rightLines with type added', () => {
    const result = computeDiff('a', 'a\nb', 'line')
    const added = result.rightLines.find((l) => l.type === 'added')
    expect(added).toBeDefined()
    expect(added?.text).toBe('b')
  })

  it('has a placeholder on the left at the same index', () => {
    const result = computeDiff('a', 'a\nb', 'line')
    const addedIdx = result.rightLines.findIndex((l) => l.type === 'added')
    expect(result.leftLines[addedIdx].type).toBe('placeholder')
    expect(result.leftLines[addedIdx].lineNumber).toBeNull()
  })
})

describe('computeDiff — single removed line', () => {
  it('places removed line in leftLines with type removed', () => {
    const result = computeDiff('a\nb', 'a', 'line')
    const removed = result.leftLines.find((l) => l.type === 'removed')
    expect(removed).toBeDefined()
    expect(removed?.text).toBe('b')
  })

  it('has a placeholder on the right at the same index', () => {
    const result = computeDiff('a\nb', 'a', 'line')
    const removedIdx = result.leftLines.findIndex((l) => l.type === 'removed')
    expect(result.rightLines[removedIdx].type).toBe('placeholder')
    expect(result.rightLines[removedIdx].lineNumber).toBeNull()
  })
})

describe('computeDiff — multiline counts', () => {
  it('produces correct line counts', () => {
    const result = computeDiff('a\nb\nc', 'a\nx\ny\nz', 'line')
    expect(result.removedCount).toBe(2) // b, c removed
    expect(result.addedCount).toBe(3)   // x, y, z added
  })
})

describe('computeDiff — word mode', () => {
  it('changed lines contain words array in word mode', () => {
    const result = computeDiff('hello world', 'hello earth', 'word')
    const changedLeft = result.leftLines.find((l) => l.type === 'removed')
    const changedRight = result.rightLines.find((l) => l.type === 'added')
    expect(changedLeft?.words).toBeDefined()
    expect(changedRight?.words).toBeDefined()
  })

  it('word chunks cover the full text content', () => {
    const result = computeDiff('hello world', 'hello earth', 'word')
    const right = result.rightLines.find((l) => l.type === 'added')
    const reconstructed = right?.words?.map((w) => w.text).join('')
    expect(reconstructed).toBe('hello earth')
  })

  it('unchanged lines have no words array', () => {
    const result = computeDiff('same\nchanged', 'same\nmodified', 'word')
    const unchanged = result.leftLines.find((l) => l.type === 'unchanged')
    expect(unchanged?.words).toBeUndefined()
  })
})
