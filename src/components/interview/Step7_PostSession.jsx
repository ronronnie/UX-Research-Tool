import { useState } from 'react'
import toast from 'react-hot-toast'
import { useStore } from '../../store/useStore.js'
import { Button, Card, Textarea, Slider } from '../ui/index.js'
import PresetChips from '../ui/PresetChips.jsx'
import { DEBRIEF_QUESTIONS } from '../../data/questions.js'
import { classifyNPS } from '../../utils/nps.js'
import clsx from 'clsx'

// ── NPS Selector ──────────────────────────────────────────────────────────────
function NPSSelector({ value, onChange }) {
  const category = value !== null ? classifyNPS(value) : null

  const CATEGORY_STYLE = {
    detractor: 'text-accent-red',
    passive:   'text-accent-amber',
    promoter:  'text-accent-green',
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-text-secondary">
          How likely are you to recommend this to a friend? (0–10)
        </span>
        {category && (
          <span className={clsx('text-sm font-bold capitalize', CATEGORY_STYLE[category])}>
            {category}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {Array.from({ length: 11 }, (_, i) => i).map(n => {
          const isSelected = value === n
          const pos = n / 10
          const color = pos < 0.7
            ? isSelected ? 'border-accent-red   text-accent-red   bg-accent-red/15'   : 'border-border text-text-muted bg-bg-tertiary hover:border-accent-red/50'
            : pos < 0.9
            ? isSelected ? 'border-accent-amber text-accent-amber bg-accent-amber/15' : 'border-border text-text-muted bg-bg-tertiary hover:border-accent-amber/50'
            :               isSelected ? 'border-accent-green text-accent-green bg-accent-green/15' : 'border-border text-text-muted bg-bg-tertiary hover:border-accent-green/50'

          return (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              className={clsx(
                'w-9 h-9 rounded-lg border text-sm font-semibold transition-all',
                color
              )}
            >
              {n}
            </button>
          )
        })}
      </div>

      <div className="flex justify-between text-xs text-text-muted">
        <span>0 — Not likely at all</span>
        <span>10 — Extremely likely</span>
      </div>
    </div>
  )
}

// ── Debrief Question ──────────────────────────────────────────────────────────
function DebriefQuestion({ question, value, presetsSelected, onChange, index }) {
  const handlePreset = (preset) => {
    const already = (presetsSelected ?? []).includes(preset)
    const nextPresets = already
      ? presetsSelected.filter(p => p !== preset)
      : [...(presetsSelected ?? []), preset]
    let text = value ?? ''
    if (!already && !text.toLowerCase().includes(preset.toLowerCase())) {
      text = text ? `${text.trim()}, ${preset}` : preset
    }
    onChange({ answer_text: text, presets_selected: nextPresets })
  }

  return (
    <div className="flex flex-col gap-2 p-4 bg-bg-secondary rounded-xl border border-border">
      <div className="flex items-start gap-3">
        <span className="min-w-[24px] h-6 flex items-center justify-center rounded-full
                         bg-bg-tertiary text-text-muted text-xs font-bold">
          {index}
        </span>
        <p className="text-sm font-medium text-text-primary">{question.text}</p>
      </div>
      <Textarea
        placeholder="Participant response…"
        value={value ?? ''}
        onChange={e => onChange({ answer_text: e.target.value })}
        rows={2}
      />
      {question.presets?.length > 0 && (
        <PresetChips
          presets={question.presets}
          selected={presetsSelected ?? []}
          onToggle={handlePreset}
        />
      )}
    </div>
  )
}

// ── Step 7 ────────────────────────────────────────────────────────────────────
export default function Step7_PostSession({ draft, back, navigate }) {
  const { updateDraftPostSession, saveDraft } = useStore()
  const ps = draft.post_session

  const update = (updates) => updateDraftPostSession(updates)

  // Debrief answers: keyed by question id
  const [debriefAnswers, setDebriefAnswers] = useState(() => ({
    dbq1: { answer_text: ps.most_confusing ?? '',         presets_selected: [] },
    dbq2: { answer_text: ps.enjoyed_most ?? '',           presets_selected: [] },
    dbq3: { answer_text: ps.change_before_launch ?? '',   presets_selected: [] },
    dbq4: { answer_text: ps.built_for ?? '',              presets_selected: ps.built_for_presets ?? [] },
  }))

  const updateDebrief = (qid, changes) => {
    const next = { ...debriefAnswers, [qid]: { ...debriefAnswers[qid], ...changes } }
    setDebriefAnswers(next)
    // Sync to store
    update({
      most_confusing:       next.dbq1.answer_text,
      enjoyed_most:         next.dbq2.answer_text,
      change_before_launch: next.dbq3.answer_text,
      built_for:            next.dbq4.answer_text,
      built_for_presets:    next.dbq4.presets_selected,
    })
  }

  const handleSave = () => {
    saveDraft()
    toast.success('Session saved successfully!')
    navigate('/analytics')
  }

  return (
    <div className="flex flex-col gap-6">
      <Card padding="sm">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-xs font-bold px-2 py-0.5 rounded bg-accent-green/15 text-accent-green">Final</span>
          <h2 className="text-base font-semibold text-text-primary">Post-session Scores</h2>
        </div>
        <p className="text-xs text-text-muted">
          Capture the final quantitative scores and closing thoughts.
        </p>
      </Card>

      {/* NPS */}
      <Card>
        <NPSSelector
          value={ps.nps_score}
          onChange={v => update({ nps_score: v })}
        />
      </Card>

      {/* Retention score */}
      <Card>
        <Slider
          label="Retention likelihood — how likely to use this over current tools?"
          min={1}
          max={10}
          value={ps.retention_score}
          onChange={v => update({ retention_score: v })}
          startLabel="Very unlikely"
          endLabel="Very likely"
          showValue
        />
      </Card>

      {/* Debrief questions */}
      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold text-text-secondary">Closing debrief</p>
        {DEBRIEF_QUESTIONS.map((q, i) => (
          <DebriefQuestion
            key={q.id}
            question={q}
            value={debriefAnswers[q.id]?.answer_text}
            presetsSelected={debriefAnswers[q.id]?.presets_selected}
            onChange={changes => updateDebrief(q.id, changes)}
            index={i + 1}
          />
        ))}
      </div>

      {/* Save */}
      <Card className="border-accent-green/30 bg-accent-green/5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-text-primary">Ready to save?</p>
            <p className="text-xs text-text-muted mt-0.5">
              This session will be added to your analytics dashboard.
            </p>
          </div>
          <Button size="lg" onClick={handleSave}>
            Save & Complete ✓
          </Button>
        </div>
      </Card>

      <div className="flex items-center justify-between">
        <Button variant="secondary" onClick={back}>← Back</Button>
      </div>
    </div>
  )
}
