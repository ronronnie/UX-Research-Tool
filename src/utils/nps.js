// ─── NPS Utilities ────────────────────────────────────────────────────────────

/**
 * Classify an NPS score (0–10) into a category.
 */
export function classifyNPS(score) {
  if (score === null || score === undefined) return null
  if (score >= 9) return 'promoter'
  if (score >= 7) return 'passive'
  return 'detractor'
}

export const NPS_LABELS = {
  promoter:  { label: 'Promoter',  colorKey: 'green' },
  passive:   { label: 'Passive',   colorKey: 'amber' },
  detractor: { label: 'Detractor', colorKey: 'red'   },
}

/**
 * Compute NPS index from an array of sessions.
 * NPS = %promoters − %detractors  (range: −100 to +100)
 */
export function computeNPS(sessions) {
  const scores = sessions.map(s => s.post_session?.nps_score).filter(v => v !== null && v !== undefined)
  if (!scores.length) return null
  const promoters  = scores.filter(s => s >= 9).length
  const detractors = scores.filter(s => s <= 6).length
  return Math.round(((promoters - detractors) / scores.length) * 100)
}

/**
 * Average NPS score (raw 0–10) across sessions.
 */
export function avgNPS(sessions) {
  const scores = sessions.map(s => s.post_session?.nps_score).filter(v => v !== null && v !== undefined)
  if (!scores.length) return null
  return Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10
}

/**
 * Breakdown: count of promoters, passives, detractors.
 */
export function npsBreakdown(sessions) {
  const scores = sessions.map(s => s.post_session?.nps_score).filter(v => v !== null && v !== undefined)
  return {
    promoters:  scores.filter(s => s >= 9).length,
    passives:   scores.filter(s => s >= 7 && s <= 8).length,
    detractors: scores.filter(s => s <= 6).length,
    total: scores.length,
  }
}
