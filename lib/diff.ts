import { diffLines, diffWords } from 'diff'
import type { DiffMode, DiffLine, DiffResult, WordChunk } from './types'

function parseWordChunks(original: string, changed: string): WordChunk[] {
  return diffWords(original, changed).map((part) => ({
    text: part.value,
    type: part.added ? 'added' : part.removed ? 'removed' : 'unchanged',
  }))
}

function ensureTrailingNewline(s: string): string {
  if (s === '') return s
  return s.endsWith('\n') ? s : s + '\n'
}

export function computeDiff(original: string, changed: string, mode: DiffMode): DiffResult {
  const parts = diffLines(ensureTrailingNewline(original), ensureTrailingNewline(changed))

  const leftLines: DiffLine[] = []
  const rightLines: DiffLine[] = []
  let leftNum = 1
  let rightNum = 1
  let addedCount = 0
  let removedCount = 0

  // Group consecutive removed/added pairs for alignment
  let i = 0
  while (i < parts.length) {
    const part = parts[i]

    if (!part.added && !part.removed) {
      // unchanged block — emit one line per text line
      const lines = splitIntoLines(part.value)
      for (const text of lines) {
        leftLines.push({ lineNumber: leftNum++, type: 'unchanged', text })
        rightLines.push({ lineNumber: rightNum++, type: 'unchanged', text })
      }
      i++
    } else {
      // collect a removed block followed immediately by an added block (or vice-versa)
      const removedParts: string[] = []
      const addedParts: string[] = []

      while (i < parts.length && (parts[i].removed || parts[i].added)) {
        if (parts[i].removed) {
          removedParts.push(...splitIntoLines(parts[i].value))
          removedCount += splitIntoLines(parts[i].value).length
        } else {
          addedParts.push(...splitIntoLines(parts[i].value))
          addedCount += splitIntoLines(parts[i].value).length
        }
        i++
      }

      const maxLen = Math.max(removedParts.length, addedParts.length)
      for (let j = 0; j < maxLen; j++) {
        if (j < removedParts.length) {
          const text = removedParts[j]
          const words =
            mode === 'word' && j < addedParts.length
              ? parseWordChunks(text, addedParts[j]).filter((c) => c.type !== 'added')
              : undefined
          leftLines.push({ lineNumber: leftNum++, type: 'removed', text, words })
        } else {
          leftLines.push({ lineNumber: null, type: 'placeholder', text: '' })
        }

        if (j < addedParts.length) {
          const text = addedParts[j]
          const words =
            mode === 'word' && j < removedParts.length
              ? parseWordChunks(removedParts[j], text).filter((c) => c.type !== 'removed')
              : undefined
          rightLines.push({ lineNumber: rightNum++, type: 'added', text, words })
        } else {
          rightLines.push({ lineNumber: null, type: 'placeholder', text: '' })
        }
      }
    }
  }

  return { leftLines, rightLines, addedCount, removedCount }
}

export function splitIntoLines(text: string): string[] {
  if (text === '') return ['']
  // Strip a single trailing newline so we don't produce a phantom empty line
  const normalized = text.endsWith('\n') ? text.slice(0, -1) : text
  return normalized.split('\n')
}
