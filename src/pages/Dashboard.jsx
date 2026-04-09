import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore.js'
import { calculateSUS, getSUSGrade, avgSUS } from '../utils/sus.js'
import { avgNPS, classifyNPS } from '../utils/nps.js'
import { taskCompletionRate, avgRetention } from '../utils/severity.js'
import {
  MetricCard, Card, Button, EmptyState,
  SkillBadge, SUSBadge,
} from '../components/ui/index.js'
import clsx from 'clsx'

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmt(val, suffix = '') {
  return val !== null && val !== undefined ? `${val}${suffix}` : '—'
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

const SKILL_FILTERS = ['all', 'beginner', 'intermediate', 'pro']

// ── Session Row ───────────────────────────────────────────────────────────────
function SessionRow({ session, onDelete }) {
  const sus      = calculateSUS(session.sus_scores)
  const grade    = getSUSGrade(sus)
  const nps      = session.post_session?.nps_score
  const npsClass = classifyNPS(nps)
  const ret      = session.post_session?.retention_score
  const tasksDone = (session.phase3 ?? []).filter(t => t.completed === 'yes').length
  const tasksTotal = (session.phase3 ?? []).length
  const name   = session.participant?.name || 'Anonymous'
  const date   = session.participant?.session_date || session.created_at

  const NPS_COLOR = {
    promoter:  'text-accent-green',
    passive:   'text-accent-amber',
    detractor: 'text-accent-red',
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4
                    border-b border-border last:border-0 hover:bg-bg-tertiary/40
                    transition-colors group">

      {/* Name + skill */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-9 h-9 rounded-full bg-bg-tertiary border border-border flex items-center
                        justify-center text-sm font-bold text-text-secondary flex-shrink-0">
          {name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-text-primary truncate">{name}</p>
          <p className="text-xs text-text-muted">{formatDate(date)}</p>
        </div>
        <SkillBadge level={session.participant?.skill_level} className="flex-shrink-0" />
      </div>

      {/* Stats */}
      <div className="flex items-center gap-6 sm:gap-8 flex-shrink-0">

        {/* SUS */}
        <div className="flex flex-col items-center">
          <span className="text-xs text-text-muted mb-1">SUS</span>
          {sus !== null
            ? <SUSBadge score={sus} label={grade.label} />
            : <span className="text-xs text-text-muted">—</span>
          }
        </div>

        {/* NPS */}
        <div className="flex flex-col items-center">
          <span className="text-xs text-text-muted mb-1">NPS</span>
          <span className={clsx('text-sm font-bold', NPS_COLOR[npsClass] ?? 'text-text-muted')}>
            {nps !== null && nps !== undefined ? nps : '—'}
          </span>
        </div>

        {/* Retention */}
        <div className="flex flex-col items-center">
          <span className="text-xs text-text-muted mb-1">Retention</span>
          <span className="text-sm font-bold text-text-primary">
            {ret !== null && ret !== undefined ? `${ret}/10` : '—'}
          </span>
        </div>

        {/* Tasks */}
        <div className="flex flex-col items-center">
          <span className="text-xs text-text-muted mb-1">Tasks</span>
          <span className="text-sm font-bold text-text-primary">
            {tasksTotal > 0 ? `${tasksDone}/${tasksTotal}` : '—'}
          </span>
        </div>

        {/* Delete */}
        <button
          type="button"
          onClick={() => onDelete(session.id)}
          className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-accent-red
                     transition-all text-lg leading-none p-1"
          title="Delete session"
        >
          ×
        </button>
      </div>
    </div>
  )
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate()
  const { sessions, deleteSession } = useStore()
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all'
    ? sessions
    : sessions.filter(s => s.participant?.skill_level === filter)

  // Metrics from all sessions (not just filtered)
  const totalSessions  = sessions.length
  const susAvg         = avgSUS(sessions)
  const susGrade       = getSUSGrade(susAvg)
  const npsAvg         = avgNPS(sessions)
  const completionRate = taskCompletionRate(sessions)
  const retentionAvg   = avgRetention(sessions)

  const handleDelete = (id) => {
    if (confirm('Delete this session? This cannot be undone.')) deleteSession(id)
  }

  return (
    <div className="flex flex-col gap-8 animate-fade-in">

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
          <p className="text-sm text-text-muted mt-0.5">
            {totalSessions} session{totalSessions !== 1 ? 's' : ''} logged
          </p>
        </div>
        <Button onClick={() => navigate('/session')}>
          + New Session
        </Button>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          title="Total Sessions"
          value={totalSessions}
          icon="♠"
          colorKey="default"
          tooltip="The total number of user testing sessions logged in this tool."
        />
        <MetricCard
          title="Avg SUS Score"
          value={susAvg ?? '—'}
          subtitle={susGrade.label !== 'N/A' ? susGrade.label : undefined}
          icon="◈"
          colorKey={
            susGrade.key === 'excellent' ? 'green' :
            susGrade.key === 'good'      ? 'blue'  :
            susGrade.key === 'okay'      ? 'amber' : 'red'
          }
          tooltip="System Usability Scale (SUS) — a 0–100 score measuring how easy the product feels to use. Above 80 is Excellent, above 68 is Good, the industry average is 68."
        />
        <MetricCard
          title="Avg NPS Score"
          value={npsAvg ?? '—'}
          subtitle="out of 10"
          icon="★"
          colorKey={
            npsAvg >= 8 ? 'green' :
            npsAvg >= 6 ? 'amber' : 'red'
          }
          tooltip="Net Promoter Score (NPS) — how likely participants are to recommend the product. 9–10 = Promoter, 7–8 = Passive, 0–6 = Detractor."
        />
        <MetricCard
          title="Task Completion"
          value={completionRate !== null ? `${completionRate}%` : '—'}
          subtitle="across all tasks"
          icon="✓"
          colorKey={
            completionRate >= 80 ? 'green' :
            completionRate >= 60 ? 'amber' : 'red'
          }
          tooltip="The percentage of assigned tasks that participants fully completed across all sessions. Higher is better — below 60% usually signals a usability problem."
        />
        <MetricCard
          title="Avg Retention"
          value={retentionAvg ?? '—'}
          subtitle="out of 10"
          icon="↑"
          colorKey={
            retentionAvg >= 8 ? 'green' :
            retentionAvg >= 5 ? 'amber' : 'red'
          }
          tooltip="How likely participants say they are to use this product instead of their current tools (1–10). Measures intent to switch, not just satisfaction."
        />
      </div>

      {/* Session list */}
      <div className="flex flex-col gap-4">
        {/* List header + filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-text-primary">Sessions</h2>

          {/* Skill filter */}
          <div className="flex gap-1 bg-bg-secondary rounded-lg p-1 border border-border w-fit">
            {SKILL_FILTERS.map(f => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={clsx(
                  'px-3 py-1 rounded-md text-xs font-medium capitalize transition-colors',
                  filter === f
                    ? 'bg-bg-tertiary text-text-primary shadow-sm'
                    : 'text-text-muted hover:text-text-secondary'
                )}
              >
                {f === 'all' ? `All (${sessions.length})` : `${f.charAt(0).toUpperCase() + f.slice(1)} (${sessions.filter(s => s.participant?.skill_level === f).length})`}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <Card>
            <EmptyState
              icon="♠"
              title={filter === 'all' ? 'No sessions logged yet' : `No ${filter} sessions`}
              description={
                filter === 'all'
                  ? 'Start your first user testing session to see results here.'
                  : `No sessions recorded for ${filter} participants yet.`
              }
              action={
                filter === 'all'
                  ? <Button onClick={() => navigate('/session')}>+ Start Session</Button>
                  : undefined
              }
            />
          </Card>
        ) : (
          <Card padding="none">
            {/* Column headers */}
            <div className="hidden sm:flex items-center gap-3 px-5 py-3 border-b border-border">
              <div className="flex-1 text-xs font-semibold text-text-muted uppercase tracking-wide">
                Participant
              </div>
              <div className="flex items-center gap-6 sm:gap-8 flex-shrink-0 pr-8">
                {['SUS', 'NPS', 'Retention', 'Tasks'].map(col => (
                  <span key={col} className="text-xs font-semibold text-text-muted uppercase tracking-wide w-16 text-center">
                    {col}
                  </span>
                ))}
              </div>
            </div>

            {/* Rows */}
            {filtered.map(s => (
              <SessionRow key={s.id} session={s} onDelete={handleDelete} />
            ))}
          </Card>
        )}
      </div>
    </div>
  )
}
