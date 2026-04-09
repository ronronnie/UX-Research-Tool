import { useState } from 'react'
import { useStore } from '../../store/useStore.js'
import { Input, Button, Card } from '../ui/index.js'
import { SKILL_LEVELS } from '../../data/questions.js'
import clsx from 'clsx'

const SKILL_META = {
  beginner:     { label: 'Beginner',     icon: '♣', desc: 'Learning the basics', color: 'accent-blue' },
  intermediate: { label: 'Intermediate', icon: '♦', desc: 'Knows the rules, developing strategy', color: 'accent-amber' },
  pro:          { label: 'Pro',           icon: '♠', desc: 'Experienced, plays regularly', color: 'accent-purple' },
}

export default function Step1_Participant({ draft, next }) {
  const { updateDraftParticipant } = useStore()
  const p = draft.participant

  const [errors, setErrors] = useState({})

  const update = (field, value) => {
    updateDraftParticipant({ [field]: value })
    if (errors[field]) setErrors(e => ({ ...e, [field]: null }))
  }

  const validate = () => {
    const e = {}
    if (!p.skill_level) e.skill_level = 'Please select a skill level'
    if (!p.session_date) e.session_date = 'Date is required'
    return e
  }

  const handleNext = () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    next()
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <h2 className="text-base font-semibold text-text-primary mb-4">Participant Details</h2>

        <div className="flex flex-col gap-4">
          {/* Name */}
          <Input
            label="Participant name (optional)"
            placeholder="e.g. Alex, P01, or leave blank"
            value={p.name}
            onChange={e => update('name', e.target.value)}
          />

          {/* Skill Level */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-text-secondary">Skill level *</span>
            <div className="grid grid-cols-3 gap-3">
              {SKILL_LEVELS.map(level => {
                const meta = SKILL_META[level]
                const selected = p.skill_level === level
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => update('skill_level', level)}
                    className={clsx(
                      'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-center',
                      selected
                        ? `border-${meta.color} bg-${meta.color}/10`
                        : 'border-border bg-bg-tertiary hover:border-border-light'
                    )}
                  >
                    <span className={clsx('text-2xl', selected && `text-${meta.color}`)}>
                      {meta.icon}
                    </span>
                    <span className={clsx('text-sm font-semibold', selected ? `text-${meta.color}` : 'text-text-primary')}>
                      {meta.label}
                    </span>
                    <span className="text-xs text-text-muted leading-tight">{meta.desc}</span>
                  </button>
                )
              })}
            </div>
            {errors.skill_level && <p className="text-xs text-accent-red">{errors.skill_level}</p>}
          </div>

          {/* Date + Moderator */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Session date *"
              type="date"
              value={p.session_date}
              onChange={e => update('session_date', e.target.value)}
              error={errors.session_date}
            />
            <Input
              label="Moderator name"
              placeholder="Your name"
              value={p.moderator_name}
              onChange={e => update('moderator_name', e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* Nav */}
      <div className="flex justify-end">
        <Button onClick={handleNext}>Continue →</Button>
      </div>
    </div>
  )
}
