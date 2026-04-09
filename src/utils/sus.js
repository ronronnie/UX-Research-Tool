// ─── SUS Score Utilities ──────────────────────────────────────────────────────

/**
 * Calculate SUS score from array of 10 ratings (1–5 each).
 * Odd-indexed questions (0,2,4,6,8): contribution = score - 1
 * Even-indexed questions (1,3,5,7,9): contribution = 5 - score
 * Total × 2.5 = SUS score (0–100)
 */
export function calculateSUS(scores) {
  if (!scores || scores.length !== 10) return null
  const sum = scores.reduce((acc, score, i) => {
    const contribution = i % 2 === 0 ? score - 1 : 5 - score
    return acc + contribution
  }, 0)
  return Math.round(sum * 2.5 * 10) / 10
}

/**
 * Return SUS grade label and colour key based on score.
 * > 80.3 = Excellent (A)
 * 68–80.3 = Good (B)
 * 51–68   = Okay (C/D)
 * < 51    = Poor (F)
 */
export function getSUSGrade(score) {
  if (score === null || score === undefined) return { label: 'N/A', key: 'muted' }
  if (score > 80.3) return { label: 'Excellent', key: 'excellent' }
  if (score >= 68)  return { label: 'Good',      key: 'good' }
  if (score >= 51)  return { label: 'Okay',       key: 'okay' }
  return                     { label: 'Poor',      key: 'poor' }
}

/**
 * Average SUS score across an array of sessions.
 */
export function avgSUS(sessions) {
  const scores = sessions
    .map(s => calculateSUS(s.sus_scores))
    .filter(v => v !== null)
  if (!scores.length) return null
  return Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10
}
