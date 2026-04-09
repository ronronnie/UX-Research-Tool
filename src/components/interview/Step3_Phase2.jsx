import { useState } from 'react'
import { useStore } from '../../store/useStore.js'
import { Button, Card } from '../ui/index.js'
import { PHASE2_QUESTIONS } from '../../data/questions.js'
import QuestionBlock from './QuestionBlock.jsx'

const emptyResponse = (q) => ({
  question_id: q.id,
  answer_text: '',
  presets_selected: [],
  tags: [],
})

export default function Step3_Phase2({ draft, next, back }) {
  const { updateDraftPhase2 } = useStore()

  const [responses, setResponses] = useState(() => {
    if (draft.phase2?.length === PHASE2_QUESTIONS.length) return draft.phase2
    return PHASE2_QUESTIONS.map(emptyResponse)
  })

  const update = (index, updates) => {
    const nextResponses = responses.map((r, i) => i === index ? { ...r, ...updates } : r)
    setResponses(nextResponses)
    updateDraftPhase2(nextResponses)
  }

  return (
    <div className="flex flex-col gap-6">
      <Card padding="sm">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-xs font-bold px-2 py-0.5 rounded bg-accent-amber/15 text-accent-amber">Phase 2</span>
          <h2 className="text-base font-semibold text-text-primary">First Impressions</h2>
        </div>
        <p className="text-xs text-text-muted">
          Show the participant the first screen. Ask these questions before they navigate anywhere.
        </p>
      </Card>

      <div className="flex flex-col gap-4">
        {PHASE2_QUESTIONS.map((q, i) => (
          <QuestionBlock
            key={q.id}
            question={q}
            response={responses[i]}
            onChange={updates => update(i, updates)}
            index={i + 1}
          />
        ))}
      </div>

      {/* Nav */}
      <div className="flex items-center justify-between">
        <Button variant="secondary" onClick={back}>← Back</Button>
        <Button onClick={next}>Continue →</Button>
      </div>
    </div>
  )
}
