import { useState } from 'react'
import { useStore } from '../../store/useStore.js'
import { Button, Card } from '../ui/index.js'
import { SUS_QUESTIONS } from '../../data/questions.js'
import { calculateSUS, getSUSGrade } from '../../utils/sus.js'
import clsx from 'clsx'

// ── SUS Question Row ──────────────────────────────────────────────────────────
function SUSRow({ question, index, value, onChange }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 bg-bg-secondary rounded-xl border border-border">
      {/* Number + text */}
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <span className="min-w-[24px] h-6 flex items-center justify-center rounded-full
                         bg-bg-tertiary text-text-muted text-xs font-bold flex-shrink-0">
          {index}
        </span>
        <p className="text-sm text-text-primary leading-relaxed">{question.text}</p>
      </div>

      {/* 1–5 rating buttons */}
      <div className="flex gap-1.5 flex-shrink-0">
        {[1, 2, 3, 4, 5].map(n => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={clsx(
              'w-9 h-9 rounded-lg border text-sm font-semibold transition-all',
              value === n
                ? 'border-accent-green text-accent-green bg-accent-green/15'
                : 'border-border text-text-muted bg-bg-tertiary hover:border-border-light hover:text-text-primary'
            )}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Live SUS Score Display ────────────────────────────────────────────────────
function SUSScoreDisplay({ scores }) {
  const answered = scores.filter(s => s !== null).length
  const susScore = answered === 10 ? calculateSUS(scores) : null
  const grade    = getSUSGrade(susScore)

  const GRADE_COLORS = {
    excellent: 'text-accent-green border-accent-green bg-accent-green/10',
    good:      'text-accent-blue  border-accent-blue  bg-accent-blue/10',
    okay:      'text-accent-amber border-accent-amber bg-accent-amber/10',
    poor:      'text-accent-red   border-accent-red   bg-accent-red/10',
    muted:     'text-text-muted   border-border       bg-bg-tertiary',
  }

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-bg-secondary">
      {/* Big score */}
      <div className={clsx(
        'w-20 h-20 rounded-xl border-2 flex flex-col items-center justify-center flex-shrink-0 transition-all',
        GRADE_COLORS[grade.key]
      )}>
        <span className="text-2xl font-bold leading-none">{susScore ?? '—'}</span>
        <span className="text-xs mt-1 font-medium opacity-80">/100</span>
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-text-primary">
          {susScore !== null ? grade.label : 'Answer all 10 questions'}
        </p>
        <p className="text-xs text-text-muted">
          {answered}/10 answered
          {susScore !== null && ' · Score updates live'}
        </p>
        <div className="flex gap-1 mt-1 flex-wrap">
          {[
            { label: 'Excellent', key: 'excellent', threshold: '>80' },
            { label: 'Good',      key: 'good',      threshold: '68–80' },
            { label: 'Okay',      key: 'okay',      threshold: '51–68' },
            { label: 'Poor',      key: 'poor',      threshold: '<51' },
          ].map(tier => (
            <span key={tier.key} className={clsx(
              'text-xs px-2 py-0.5 rounded border',
              grade.key === tier.key ? GRADE_COLORS[tier.key] : 'text-text-muted border-border bg-bg-tertiary opacity-50'
            )}>
              {tier.label} {tier.threshold}
            </span>
          ))}
        </div>
      </div>

      {/* Scale hint */}
      <div className="ml-auto hidden sm:flex flex-col gap-0.5 text-right">
        <p className="text-xs text-text-muted font-medium">Rating scale</p>
        <p className="text-xs text-text-muted">1 = Strongly disagree</p>
        <p className="text-xs text-text-muted">5 = Strongly agree</p>
      </div>
    </div>
  )
}

// ── Step 6 ────────────────────────────────────────────────────────────────────
export default function Step6_SUS({ draft, next, back }) {
  const { updateDraftSUS } = useStore()

  const [scores, setScores] = useState(() =>
    draft.sus_scores?.length === 10 ? [...draft.sus_scores] : Array(10).fill(null)
  )

  const update = (index, value) => {
    const next = scores.map((s, i) => i === index ? value : s)
    setScores(next)
    updateDraftSUS(next)
  }

  return (
    <div className="flex flex-col gap-6">
      <Card padding="sm">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-xs font-bold px-2 py-0.5 rounded bg-accent-blue/15 text-accent-blue">Phase 5</span>
          <h2 className="text-base font-semibold text-text-primary">SUS Questionnaire</h2>
        </div>
        <p className="text-xs text-text-muted">
          Read each statement. Participant rates 1 (strongly disagree) to 5 (strongly agree).
        </p>
      </Card>

      {/* Live score */}
      <SUSScoreDisplay scores={scores} />

      {/* Questions */}
      <div className="flex flex-col gap-3">
        {SUS_QUESTIONS.map((q, i) => (
          <SUSRow
            key={q.id}
            question={q}
            index={i + 1}
            value={scores[i]}
            onChange={v => update(i, v)}
          />
        ))}
      </div>

      <div className="flex items-center justify-between">
        <Button variant="secondary" onClick={back}>← Back</Button>
        <Button onClick={next}>Continue →</Button>
      </div>
    </div>
  )
}
