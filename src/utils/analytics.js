// ─── Analytics Data Transformations ──────────────────────────────────────────
// All chart data derivations live here so chart components stay presentational.

import { calculateSUS, avgSUS } from './sus.js'
import { classifyNPS, npsBreakdown } from './nps.js'

const SKILL_LEVELS = ['beginner', 'intermediate', 'pro']
const TASK_IDS     = ['A', 'B', 'C']

// ── SUS ───────────────────────────────────────────────────────────────────────

/** Line chart: SUS score per session */
export function getSUSLineData(sessions) {
  return sessions
    .map((s, i) => ({
      session: `S${i + 1}`,
      label:   s.participant?.name || `Session ${i + 1}`,
      sus:     calculateSUS(s.sus_scores),
      skill:   s.participant?.skill_level,
    }))
    .filter(d => d.sus !== null)
}

/** Bar chart: avg SUS by skill level */
export function getSUSBySkillData(sessions) {
  return SKILL_LEVELS.map(level => {
    const group = sessions.filter(s => s.participant?.skill_level === level)
    return {
      level: level.charAt(0).toUpperCase() + level.slice(1),
      avg:   avgSUS(group) ?? 0,
      count: group.length,
    }
  }).filter(d => d.count > 0)
}

// ── Task Performance ──────────────────────────────────────────────────────────

/** Grouped bar: completion % by task × skill level */
export function getTaskCompletionGrouped(sessions) {
  return TASK_IDS.map(taskId => {
    const row = { task: `Task ${taskId}` }
    SKILL_LEVELS.forEach(level => {
      const results = sessions
        .filter(s => s.participant?.skill_level === level)
        .flatMap(s => s.phase3 ?? [])
        .filter(t => t.task_id === taskId)
      row[level] = results.length
        ? Math.round((results.filter(t => t.completed === 'yes').length / results.length) * 100)
        : null
    })
    return row
  })
}

/** Bar: avg time (seconds) per task */
export function getAvgTimePerTask(sessions) {
  return TASK_IDS.map(taskId => {
    const times = sessions
      .flatMap(s => s.phase3 ?? [])
      .filter(t => t.task_id === taskId && (t.time_seconds ?? 0) > 0)
      .map(t => t.time_seconds)
    const avg = times.length
      ? Math.round(times.reduce((a, b) => a + b, 0) / times.length)
      : 0
    return { task: `Task ${taskId}`, avg, count: times.length }
  })
}

/** Bar: avg error count per task */
export function getAvgErrorsPerTask(sessions) {
  return TASK_IDS.map(taskId => {
    const errors = sessions
      .flatMap(s => s.phase3 ?? [])
      .filter(t => t.task_id === taskId)
      .map(t => t.error_count ?? 0)
    const avg = errors.length
      ? Math.round((errors.reduce((a, b) => a + b, 0) / errors.length) * 10) / 10
      : 0
    return { task: `Task ${taskId}`, avg, count: errors.length }
  })
}

/** Bar: avg SEQ score per task */
export function getAvgSEQPerTask(sessions) {
  return TASK_IDS.map(taskId => {
    const seqs = sessions
      .flatMap(s => s.phase3 ?? [])
      .filter(t => t.task_id === taskId && t.seq_score !== null && t.seq_score !== undefined)
      .map(t => t.seq_score)
    const avg = seqs.length
      ? Math.round((seqs.reduce((a, b) => a + b, 0) / seqs.length) * 10) / 10
      : 0
    return { task: `Task ${taskId}`, avg, count: seqs.length }
  })
}

// ── Pre-session Insights ──────────────────────────────────────────────────────

/** Horizontal bar: frequency of preset selections for a given phase1 question */
export function getPresetFrequency(sessions, questionId) {
  const counts = {}
  sessions.forEach(s => {
    const r = (s.phase1 ?? []).find(r => r.question_id === questionId)
    ;(r?.presets_selected ?? []).forEach(p => {
      counts[p] = (counts[p] ?? 0) + 1
    })
  })
  return Object.entries(counts)
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
}

/** Pie: skill level distribution */
export function getSkillDistribution(sessions) {
  return SKILL_LEVELS.map(level => ({
    name:  level.charAt(0).toUpperCase() + level.slice(1),
    value: sessions.filter(s => s.participant?.skill_level === level).length,
  })).filter(d => d.value > 0)
}

// ── First Impressions ─────────────────────────────────────────────────────────

/** Bar: tag frequency across all phase2 responses */
export function getPhase2TagFrequency(sessions) {
  const counts = { confusion: 0, delight: 0, error: 0, question: 0 }
  sessions.forEach(s => {
    ;(s.phase2 ?? []).forEach(r => {
      ;(r.tags ?? []).forEach(tag => { counts[tag] = (counts[tag] ?? 0) + 1 })
    })
  })
  return Object.entries(counts).map(([tag, count]) => ({ tag, count }))
}

/** Ranked list: most common preset selections for p2q1 */
export function getFirstImpressionPresets(sessions) {
  return getPresetFrequency(
    sessions.map(s => ({ ...s, phase1: s.phase2 ?? [] })),
    'p2q1'
  )
}

// ── NPS & Retention ───────────────────────────────────────────────────────────

/** Stacked bar data for NPS breakdown (single bar, stacked) */
export function getNPSStackedData(sessions) {
  const { promoters, passives, detractors } = npsBreakdown(sessions)
  return [{ name: 'Participants', Promoters: promoters, Passives: passives, Detractors: detractors }]
}

/** Line chart: retention score per session */
export function getRetentionLineData(sessions) {
  return sessions
    .map((s, i) => ({
      session: `S${i + 1}`,
      label:   s.participant?.name || `Session ${i + 1}`,
      score:   s.post_session?.retention_score ?? null,
      skill:   s.participant?.skill_level,
    }))
    .filter(d => d.score !== null)
}

/** Scatter: SUS vs retention, coloured by skill */
export function getSUSvsRetentionData(sessions) {
  return sessions
    .map(s => ({
      sus:       calculateSUS(s.sus_scores),
      retention: s.post_session?.retention_score ?? null,
      skill:     s.participant?.skill_level,
      name:      s.participant?.name || 'Anon',
    }))
    .filter(d => d.sus !== null && d.retention !== null)
}
