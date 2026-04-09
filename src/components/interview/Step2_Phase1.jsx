import { useState } from 'react'
import { useStore } from '../../store/useStore.js'
import { Button, Card } from '../ui/index.js'
import { PHASE1_QUESTIONS } from '../../data/questions.js'
import QuestionBlock from './QuestionBlock.jsx'

const emptyResponse = (q) => ({
  question_id: q.id,
  answer_text: '',
  presets_selected: [],
  scale_value: null,
  tags: [],
})

export default function Step2_Phase1({ draft, next, back }) {
  const { updateDraftPhase1 } = useStore()

  const [responses, setResponses] = useState(() => {
    if (draft.phase1?.length === PHASE1_QUESTIONS.length) return draft.phase1
    return PHASE1_QUESTIONS.map(emptyResponse)
  })

  const update = (index, updates) => {
    const next = responses.map((r, i) => i === index ? { ...r, ...updates } : r)
    setResponses(next)
    updateDraftPhase1(next)
  }

  return (
    <div className="flex flex-col gap-6">
      <Card padding="sm">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-xs font-bold px-2 py-0.5 rounded bg-accent-blue/15 text-accent-blue">Phase 1</span>
          <h2 className="text-base font-semibold text-text-primary">Pre-session Interview</h2>
        </div>
        <p className="text-xs text-text-muted">
          Ask these questions before the participant interacts with the product.
        </p>
      </Card>

      <div className="flex flex-col gap-4">
        {PHASE1_QUESTIONS.map((q, i) => (
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
