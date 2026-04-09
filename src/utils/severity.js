// ─── Severity Tagger ─────────────────────────────────────────────────────────
// Scans all sessions for answers tagged [confusion] or [error] and groups them
// into a severity table used by the Analytics dashboard.

/**
 * Assign severity badge based on occurrence count.
 * Critical: 4+, Major: 2–3, Minor: 1
 */
export function getSeverity(count) {
  if (count >= 4) return { label: 'Critical', key: 'critical' }
  if (count >= 2) return { label: 'Major',    key: 'major'    }
  return                  { label: 'Minor',    key: 'minor'    }
}

/**
 * Extract all tagged observations from a session's phase responses.
 * Returns array of { text, tags, phase, skill_level, session_id }
 */
export function extractObservations(session) {
  const obs = []
  const skill = session.participant?.skill_level
  const sid   = session.id

  // Phase 1
  ;(session.phase1 || []).forEach(r => {
    if (r.tags?.length) {
      obs.push({ text: r.answer_text || r.presets_selected?.join(', ') || '', tags: r.tags, phase: 'Phase 1', skill_level: skill, session_id: sid })
    }
  })

  // Phase 2
  ;(session.phase2 || []).forEach(r => {
    if (r.tags?.length) {
      obs.push({ text: r.answer_text || r.presets_selected?.join(', ') || '', tags: r.tags, phase: 'Phase 2', skill_level: skill, session_id: sid })
    }
  })

  // Phase 3 tasks
  ;(session.phase3 || []).forEach(task => {
    if (task.tags?.length) {
      obs.push({ text: `Task ${task.task_id}: ${task.notes || ''}`, tags: task.tags, phase: 'Phase 3', skill_level: skill, session_id: sid })
    }
  })

  // Phase 4 frustration moments (always tagged as error/confusion implicitly)
  ;(session.phase4?.frustration_moments || []).forEach(text => {
    obs.push({ text, tags: ['confusion'], phase: 'Phase 4', skill_level: skill, session_id: sid })
  })

  // Phase 4 delight moments
  ;(session.phase4?.delight_moments || []).forEach(text => {
    obs.push({ text, tags: ['delight'], phase: 'Phase 4', skill_level: skill, session_id: sid })
  })

  return obs
}

/**
 * Build the severity findings table from all sessions.
 * Groups by issue text, counts occurrences of confusion/error tags.
 * Returns array of { description, count, severity } sorted by count desc.
 */
export function buildSeverityTable(sessions) {
  const counts = {}

  sessions.forEach(session => {
    const obs = extractObservations(session)
    obs.forEach(({ text, tags }) => {
      if (!text) return
      const hasCriticalTag = tags.some(t => t === 'confusion' || t === 'error')
      if (!hasCriticalTag) return
      const key = text.trim().toLowerCase().slice(0, 80)
      if (!counts[key]) counts[key] = { description: text.trim(), count: 0 }
      counts[key].count += 1
    })
  })

  return Object.values(counts)
    .filter(item => item.count >= 1)
    .map(item => ({ ...item, severity: getSeverity(item.count) }))
    .sort((a, b) => b.count - a.count)
}

/**
 * Task completion rate across all sessions (%).
 */
export function taskCompletionRate(sessions) {
  const results = sessions.flatMap(s => s.phase3 || [])
  if (!results.length) return null
  const completed = results.filter(t => t.completed === 'yes').length
  return Math.round((completed / results.length) * 100)
}

/**
 * Average retention score across sessions.
 */
export function avgRetention(sessions) {
  const scores = sessions
    .map(s => s.post_session?.retention_score)
    .filter(v => v !== null && v !== undefined)
  if (!scores.length) return null
  return Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10
}
