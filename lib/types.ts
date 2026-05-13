export type DiffMode = 'line' | 'word'
export type ChangeType = 'added' | 'removed' | 'unchanged' | 'placeholder'

export interface WordChunk {
  text: string
  type: 'added' | 'removed' | 'unchanged'
}

export interface DiffLine {
  lineNumber: number | null
  type: ChangeType
  text: string
  words?: WordChunk[]
}

export interface DiffResult {
  leftLines: DiffLine[]
  rightLines: DiffLine[]
  addedCount: number
  removedCount: number
}
