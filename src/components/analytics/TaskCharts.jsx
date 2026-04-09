import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ReferenceLine, Cell,
} from 'recharts'
import { Card, SectionTitle } from '../ui/index.js'
import {
  GRID_COLOR, AXIS_STYLE, AXIS_LINE, TICK_LINE,
  TOOLTIP_STYLE, SKILL_COLORS, TASK_COLORS,
  GREEN, AMBER, RED, BLUE, PURPLE,
} from './chartTheme.js'
import {
  getTaskCompletionGrouped,
  getAvgTimePerTask,
  getAvgErrorsPerTask,
  getAvgSEQPerTask,
} from '../../utils/analytics.js'

// ── Grouped completion chart ──────────────────────────────────────────────────
function TaskCompletionChart({ sessions }) {
  const data = getTaskCompletionGrouped(sessions)

  return (
    <Card>
      <p className="text-sm font-semibold text-text-primary mb-1">Task Completion Rate by Skill Level</p>
      <p className="text-xs text-text-muted mb-4">
        % of participants who fully completed each task, grouped by skill level.
      </p>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} vertical={false} />
          <XAxis dataKey="task" tick={AXIS_STYLE} axisLine={AXIS_LINE} tickLine={false} />
          <YAxis domain={[0, 100]} tick={AXIS_STYLE} axisLine={AXIS_LINE} tickLine={TICK_LINE}
            tickFormatter={v => `${v}%`} />
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            formatter={(val, name) => [`${val ?? '—'}%`, name.charAt(0).toUpperCase() + name.slice(1)]}
            cursor={{ fill: 'rgba(255,255,255,0.03)' }}
          />
          <Legend
            formatter={v => <span style={{ color: '#94a3b8', fontSize: '12px', textTransform: 'capitalize' }}>{v}</span>}
          />
          <Bar dataKey="beginner"     fill={SKILL_COLORS.beginner}     radius={[4, 4, 0, 0]} maxBarSize={24} />
          <Bar dataKey="intermediate" fill={SKILL_COLORS.intermediate} radius={[4, 4, 0, 0]} maxBarSize={24} />
          <Bar dataKey="pro"          fill={SKILL_COLORS.pro}          radius={[4, 4, 0, 0]} maxBarSize={24} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}

// ── Avg time per task ─────────────────────────────────────────────────────────
function AvgTimeChart({ sessions }) {
  const data = getAvgTimePerTask(sessions)
  const fmtTime = (s) => s >= 60 ? `${Math.floor(s/60)}m ${s%60}s` : `${s}s`

  return (
    <Card>
      <p className="text-sm font-semibold text-text-primary mb-1">Avg Time on Task</p>
      <p className="text-xs text-text-muted mb-4">
        Average time (seconds) participants spent on each task.
      </p>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} vertical={false} />
          <XAxis dataKey="task" tick={AXIS_STYLE} axisLine={AXIS_LINE} tickLine={false} />
          <YAxis tick={AXIS_STYLE} axisLine={AXIS_LINE} tickLine={TICK_LINE}
            tickFormatter={v => `${v}s`} />
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            formatter={(val) => [fmtTime(val), 'Avg time']}
            cursor={{ fill: 'rgba(255,255,255,0.03)' }}
          />
          <Bar dataKey="avg" radius={[6, 6, 0, 0]} maxBarSize={60}>
            {data.map(entry => (
              <Cell key={entry.task} fill={TASK_COLORS[entry.task] ?? BLUE} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}

// ── Avg error count per task ──────────────────────────────────────────────────
function AvgErrorsChart({ sessions }) {
  const data = getAvgErrorsPerTask(sessions)

  return (
    <Card>
      <p className="text-sm font-semibold text-text-primary mb-1">Avg Error Count per Task</p>
      <p className="text-xs text-text-muted mb-4">
        Average number of errors observed per task. Lower is better.
      </p>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} vertical={false} />
          <XAxis dataKey="task" tick={AXIS_STYLE} axisLine={AXIS_LINE} tickLine={false} />
          <YAxis tick={AXIS_STYLE} axisLine={AXIS_LINE} tickLine={TICK_LINE} />
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            formatter={(val) => [val, 'Avg errors']}
            cursor={{ fill: 'rgba(255,255,255,0.03)' }}
          />
          <Bar dataKey="avg" radius={[6, 6, 0, 0]} maxBarSize={60}>
            {data.map(entry => (
              <Cell
                key={entry.task}
                fill={entry.avg <= 1 ? GREEN : entry.avg <= 2 ? AMBER : RED}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}

// ── Avg SEQ score per task ────────────────────────────────────────────────────
function AvgSEQChart({ sessions }) {
  const data = getAvgSEQPerTask(sessions)

  return (
    <Card>
      <p className="text-sm font-semibold text-text-primary mb-1">Avg SEQ Score per Task</p>
      <p className="text-xs text-text-muted mb-4">
        Single Ease Question (1–7). Above 5 is considered good. Reference line at 5.
      </p>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} vertical={false} />
          <XAxis dataKey="task" tick={AXIS_STYLE} axisLine={AXIS_LINE} tickLine={false} />
          <YAxis domain={[0, 7]} tick={AXIS_STYLE} axisLine={AXIS_LINE} tickLine={TICK_LINE} />
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            formatter={(val) => [val, 'Avg SEQ']}
            cursor={{ fill: 'rgba(255,255,255,0.03)' }}
          />
          <ReferenceLine
            y={5}
            stroke={GREEN}
            strokeDasharray="6 3"
            label={{ value: 'Good (5)', position: 'insideTopRight', fill: GREEN, fontSize: 11 }}
          />
          <Bar dataKey="avg" radius={[6, 6, 0, 0]} maxBarSize={60}>
            {data.map(entry => (
              <Cell
                key={entry.task}
                fill={entry.avg >= 5 ? GREEN : entry.avg >= 3 ? AMBER : RED}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}

// ── Section export ────────────────────────────────────────────────────────────
export default function TaskCharts({ sessions }) {
  return (
    <section className="flex flex-col gap-4">
      <SectionTitle>Task Performance</SectionTitle>
      <TaskCompletionChart sessions={sessions} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AvgTimeChart   sessions={sessions} />
        <AvgErrorsChart sessions={sessions} />
        <AvgSEQChart    sessions={sessions} />
      </div>
    </section>
  )
}
