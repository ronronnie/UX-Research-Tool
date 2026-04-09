import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore.js'
import { MetricCard, Button, EmptyState, Card } from '../components/ui/index.js'
import { avgSUS, getSUSGrade } from '../utils/sus.js'
import { avgNPS } from '../utils/nps.js'
import { taskCompletionRate, avgRetention } from '../utils/severity.js'
import SUSCharts  from '../components/analytics/SUSCharts.jsx'
import TaskCharts from '../components/analytics/TaskCharts.jsx'

export default function Analytics() {
  const navigate   = useNavigate()
  const { sessions } = useStore()

  // ── Top-level metrics ───────────────────────────────────────────────────────
  const totalSessions  = sessions.length
  const susAvg         = avgSUS(sessions)
  const susGrade       = getSUSGrade(susAvg)
  const npsAvg         = avgNPS(sessions)
  const completionRate = taskCompletionRate(sessions)
  const retentionAvg   = avgRetention(sessions)

  // ── Empty state ─────────────────────────────────────────────────────────────
  if (totalSessions === 0) {
    return (
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-text-primary mb-8">Analytics</h1>
        <Card>
          <EmptyState
            icon="◈"
            title="No sessions to analyse"
            description="Run at least one user testing session to start seeing charts and insights here."
            action={<Button onClick={() => navigate('/session')}>+ Start First Session</Button>}
          />
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-10 animate-fade-in">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Analytics</h1>
          <p className="text-sm text-text-muted mt-0.5">
            Insights across {totalSessions} session{totalSessions !== 1 ? 's' : ''}
          </p>
        </div>
        <Button variant="secondary" onClick={() => navigate('/session')}>
          + New Session
        </Button>
      </div>

      {/* Summary metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          title="Total Sessions"
          value={totalSessions}
          icon="♠"
          colorKey="default"
          tooltip="Total number of user testing sessions recorded."
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
          tooltip="System Usability Scale (SUS) — 0 to 100. Above 80 is Excellent, above 68 is Good (industry average)."
        />
        <MetricCard
          title="Avg NPS Score"
          value={npsAvg ?? '—'}
          subtitle="out of 10"
          icon="★"
          colorKey={npsAvg >= 8 ? 'green' : npsAvg >= 6 ? 'amber' : 'red'}
          tooltip="Net Promoter Score (NPS) — how likely participants are to recommend. 9–10 = Promoter, 7–8 = Passive, 0–6 = Detractor."
        />
        <MetricCard
          title="Task Completion"
          value={completionRate !== null ? `${completionRate}%` : '—'}
          subtitle="across all tasks"
          icon="✓"
          colorKey={completionRate >= 80 ? 'green' : completionRate >= 60 ? 'amber' : 'red'}
          tooltip="Percentage of tasks that were fully completed across all sessions and participants."
        />
        <MetricCard
          title="Avg Retention"
          value={retentionAvg ?? '—'}
          subtitle="out of 10"
          icon="↑"
          colorKey={retentionAvg >= 8 ? 'green' : retentionAvg >= 5 ? 'amber' : 'red'}
          tooltip="How likely participants say they are to use this product over their current tools (1–10)."
        />
      </div>

      {/* SUS charts */}
      <SUSCharts sessions={sessions} />

      {/* Task performance charts */}
      <TaskCharts sessions={sessions} />

    </div>
  )
}
