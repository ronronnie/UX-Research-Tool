import { useState } from 'react'
import { useStore } from '../../store/useStore.js'
import { Button, Card, Input, Textarea } from '../ui/index.js'
import clsx from 'clsx'

// ── Moment Logger ─────────────────────────────────────────────────────────────
function MomentLogger({ label, items, onAdd, onRemove, variant }) {
  const [text, setText] = useState('')

  const add = () => {
    const trimmed = text.trim()
    if (!trimmed) return
    onAdd(trimmed)
    setText('')
  }

  const handleKey = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); add() }
  }

  const colors = {
    delight:     { border: 'border-accent-green/30', bg: 'bg-accent-green/10', text: 'text-accent-green', icon: '✨', pill: 'border-accent-green/40 text-accent-green' },
    frustration: { border: 'border-accent-red/30',   bg: 'bg-accent-red/10',   text: 'text-accent-red',   icon: '⚠',  pill: 'border-accent-red/40   text-accent-red'   },
  }
  const c = colors[variant]

  return (
    <div className={clsx('rounded-xl border p-4 flex flex-col gap-3', c.border, c.bg)}>
      <div className="flex items-center gap-2">
        <span className="text-base">{c.icon}</span>
        <h3 className={clsx('text-sm font-semibold', c.text)}>{label}</h3>
        {items.length > 0 && (
          <span className={clsx('ml-auto text-xs font-bold px-2 py-0.5 rounded-full border', c.pill)}>
            {items.length}
          </span>
        )}
      </div>

      {/* Input row */}
      <div className="flex gap-2">
        <input
          className="flex-1 bg-bg-primary border border-border rounded-lg px-3 py-2 text-sm
                     text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-blue
                     focus:ring-1 focus:ring-accent-blue/30 transition-colors"
          placeholder={`Log a ${variant} moment… (Enter to add)`}
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKey}
        />
        <Button size="sm" variant="secondary" onClick={add}>Add</Button>
      </div>

      {/* Logged items */}
      {items.length > 0 && (
        <ul className="flex flex-col gap-1.5">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-2 bg-bg-primary rounded-lg px-3 py-2 border border-border/50">
              <span className={clsx('text-xs mt-0.5', c.text)}>{c.icon}</span>
              <span className="flex-1 text-sm text-text-primary">{item}</span>
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="text-text-muted hover:text-accent-red text-xs ml-1 transition-colors"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      {items.length === 0 && (
        <p className="text-xs text-text-muted italic">Nothing logged yet</p>
      )}
    </div>
  )
}

// ── Step 5 ────────────────────────────────────────────────────────────────────
export default function Step5_Phase4({ draft, next, back }) {
  const { updateDraftPhase4 } = useStore()
  const p4 = draft.phase4

  const update = (updates) => updateDraftPhase4(updates)

  const addDelight = (text) =>
    update({ delight_moments: [...(p4.delight_moments ?? []), text] })

  const removeDelight = (i) =>
    update({ delight_moments: p4.delight_moments.filter((_, idx) => idx !== i) })

  const addFrustration = (text) =>
    update({ frustration_moments: [...(p4.frustration_moments ?? []), text] })

  const removeFrustration = (i) =>
    update({ frustration_moments: p4.frustration_moments.filter((_, idx) => idx !== i) })

  return (
    <div className="flex flex-col gap-6">
      <Card padding="sm">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-xs font-bold px-2 py-0.5 rounded bg-accent-purple/15 text-accent-purple">Phase 4</span>
          <h2 className="text-base font-semibold text-text-primary">Free Exploration</h2>
        </div>
        <p className="text-xs text-text-muted">
          Let the participant explore freely. Log standout moments as they occur.
        </p>
      </Card>

      <MomentLogger
        label="Delight moments"
        items={p4.delight_moments ?? []}
        onAdd={addDelight}
        onRemove={removeDelight}
        variant="delight"
      />

      <MomentLogger
        label="Frustration moments"
        items={p4.frustration_moments ?? []}
        onAdd={addFrustration}
        onRemove={removeFrustration}
        variant="frustration"
      />

      <Textarea
        label="General notes"
        placeholder="Overall observations, body language, notable quotes…"
        value={p4.general_notes ?? ''}
        onChange={e => update({ general_notes: e.target.value })}
        rows={3}
      />

      <div className="flex items-center justify-between">
        <Button variant="secondary" onClick={back}>← Back</Button>
        <Button onClick={next}>Continue →</Button>
      </div>
    </div>
  )
}
