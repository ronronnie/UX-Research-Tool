import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ReferenceLine, Cell,
} from 'recharts'
import { Card, SectionTitle } from '../ui/index.js'
import {
  GRID_COLOR, AXIS_STYLE, AXIS_LINE, TICK_LINE,
  TOOLTIP_STYLE, SKILL_COLORS, GREEN, AMBER, BLUE, MUTED,
} from './chartTheme.js'
import { getSUSLineData, getSUSBySkillData } from '../../utils/analytics.js'

// ── Custom tooltip for SUS line ───────────────────────────────────────────────
function SUSLineTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div style={TOOLTIP_STYLE} className="px-3 py-2 rounded-lg">
      <p className="font-semibold text-text-primary mb-1">{d.label}</p>
      <p style={{ color: GREEN }}>SUS: <strong>{d.sus}</strong></p>
      <p style={{ color: MUTED }} className="capitalize text-xs mt-0.5">{d.skill}</p>
    </div>
  )
}

// ── SUS Line Chart ────────────────────────────────────────────────────────────
function SUSLineChart({ sessions }) {
  const data = getSUSLineData(sessions)

  return (
    <Card>
      <p className="text-sm font-semibold text-text-primary mb-1">SUS Score per Session</p>
      <p className="text-xs text-text-muted mb-4">
        Each point is one session. Reference lines: 68 (industry average), 80 (good threshold).
      </p>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
          <XAxis dataKey="session" tick={AXIS_STYLE} axisLine={AXIS_LINE} tickLine={TICK_LINE} />
          <YAxis domain={[0, 100]} tick={AXIS_STYLE} axisLine={AXIS_LINE} tickLine={TICK_LINE} />
          <Tooltip content={<SUSLineTooltip />} />

          {/* Reference lines */}
          <ReferenceLine
            y={80}
            stroke={GREEN}
            strokeDasharray="6 3"
            label={{ value: 'Good (80)', position: 'insideTopRight', fill: GREEN, fontSize: 11 }}
          />
          <ReferenceLine
            y={68}
            stroke={AMBER}
            strokeDasharray="6 3"
            label={{ value: 'Avg (68)', position: 'insideBottomRight', fill: AMBER, fontSize: 11 }}
          />

          <Line
            type="monotone"
            dataKey="sus"
            stroke={GREEN}
            strokeWidth={2}
            dot={{ fill: GREEN, r: 4, strokeWidth: 0 }}
            activeDot={{ r: 6, fill: GREEN }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )
}

// ── SUS by Skill Level Bar Chart ──────────────────────────────────────────────
function SUSBySkillChart({ sessions }) {
  const data = getSUSBySkillData(sessions)

  return (
    <Card>
      <p className="text-sm font-semibold text-text-primary mb-1">Avg SUS by Skill Level</p>
      <p className="text-xs text-text-muted mb-4">
        Average SUS score broken down by participant skill level.
      </p>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} vertical={false} />
          <XAxis dataKey="level" tick={AXIS_STYLE} axisLine={AXIS_LINE} tickLine={false} />
          <YAxis domain={[0, 100]} tick={AXIS_STYLE} axisLine={AXIS_LINE} tickLine={TICK_LINE} />
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            formatter={(val) => [`${val}`, 'Avg SUS']}
            cursor={{ fill: 'rgba(255,255,255,0.03)' }}
          />
          <ReferenceLine y={68} stroke={AMBER} strokeDasharray="6 3" />
          <ReferenceLine y={80} stroke={GREEN} strokeDasharray="6 3" />
          <Bar dataKey="avg" radius={[6, 6, 0, 0]} maxBarSize={60}>
            {data.map(entry => (
              <Cell key={entry.level} fill={SKILL_COLORS[entry.level] ?? BLUE} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}

// ── Section export ────────────────────────────────────────────────────────────
export default function SUSCharts({ sessions }) {
  return (
    <section className="flex flex-col gap-4">
      <SectionTitle>SUS Scores</SectionTitle>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SUSLineChart sessions={sessions} />
        <SUSBySkillChart sessions={sessions} />
      </div>
    </section>
  )
}
