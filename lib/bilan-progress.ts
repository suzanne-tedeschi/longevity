/**
 * Bilan Progress — localStorage-based save/resume system.
 *
 * Saves scores + position after each answer so users can quit and resume later.
 * Cleared automatically when the bilan is submitted (final save to Supabase).
 */

const STORAGE_PREFIX = 'bilan_progress_'

export interface BilanProgress {
  scores: Record<string, number>
  sectionIndex: number
  testIndex: number
  /** For nutrition: which part is active */
  activePart?: string
  /** For nutrition: which parts are done */
  partsDone?: Record<string, boolean>
  /** Timestamp of last update */
  updatedAt: number
}

function getKey(bilanType: string): string {
  return `${STORAGE_PREFIX}${bilanType}`
}

/** Save current progress to localStorage */
export function saveProgress(
  bilanType: string,
  scores: Record<string, number>,
  sectionIndex: number,
  testIndex: number,
  extra?: { activePart?: string; partsDone?: Record<string, boolean> }
): void {
  try {
    const data: BilanProgress = {
      scores,
      sectionIndex,
      testIndex,
      activePart: extra?.activePart,
      partsDone: extra?.partsDone,
      updatedAt: Date.now(),
    }
    localStorage.setItem(getKey(bilanType), JSON.stringify(data))
  } catch {
    // localStorage might be full or unavailable — silently ignore
  }
}

/** Load saved progress from localStorage (returns null if none exists) */
export function loadProgress(bilanType: string): BilanProgress | null {
  try {
    const raw = localStorage.getItem(getKey(bilanType))
    if (!raw) return null
    const data: BilanProgress = JSON.parse(raw)
    // Validate shape
    if (!data.scores || typeof data.sectionIndex !== 'number' || typeof data.testIndex !== 'number') {
      return null
    }
    return data
  } catch {
    return null
  }
}

/** Clear saved progress (call after successful final submission) */
export function clearProgress(bilanType: string): void {
  try {
    localStorage.removeItem(getKey(bilanType))
  } catch {
    // ignore
  }
}

/** Check if progress exists for a bilan type */
export function hasProgress(bilanType: string): boolean {
  try {
    return localStorage.getItem(getKey(bilanType)) !== null
  } catch {
    return false
  }
}

/**
 * Get the completion percentage for a bilan based on saved progress.
 * Returns 0 if no progress found.
 * `totalQuestions` is the total number of questions in the bilan.
 */
export function getProgressPercent(bilanType: string, totalQuestions: number): number {
  const progress = loadProgress(bilanType)
  if (!progress) return 0
  const answered = Object.keys(progress.scores).length
  return totalQuestions > 0 ? Math.round((answered / totalQuestions) * 100) : 0
}

/** Get all bilan types that have in-progress drafts */
export function getAllInProgress(): { bilanType: string; progress: BilanProgress }[] {
  const results: { bilanType: string; progress: BilanProgress }[] = []
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith(STORAGE_PREFIX)) {
        const bilanType = key.slice(STORAGE_PREFIX.length)
        const progress = loadProgress(bilanType)
        if (progress && Object.keys(progress.scores).length > 0) {
          results.push({ bilanType, progress })
        }
      }
    }
  } catch {
    // ignore
  }
  return results
}

/** Total question counts per bilan type (used for % computation on dashboard) */
export const BILAN_TOTAL_QUESTIONS: Record<string, number> = {
  mobilite: 43,
  nutrition: 57,
  sommeil: 33,
  emotionnel: 55,
  stress: 40,
  digestif: 15,
}
