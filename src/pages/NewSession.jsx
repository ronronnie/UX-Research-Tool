import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore.js'
import { ProgressBar, Button } from '../components/ui/index.js'

import Step1_Participant    from '../components/interview/Step1_Participant.jsx'
import Step2_Phase1         from '../components/interview/Step2_Phase1.jsx'
import Step3_Phase2         from '../components/interview/Step3_Phase2.jsx'
import Step4_Phase3         from '../components/interview/Step4_Phase3.jsx'
import Step5_Phase4         from '../components/interview/Step5_Phase4.jsx'
import Step6_SUS            from '../components/interview/Step6_SUS.jsx'
import Step7_PostSession    from '../components/interview/Step7_PostSession.jsx'

const STEP_LABELS = [
  'Participant',
  'Pre-Session',
  'First Impressions',
  'Task Flows',
  'Free Exploration',
  'SUS Score',
  'Post-Session',
]

export default function NewSession() {
  const [step, setStep] = useState(1)
  const { draft, startDraft, discardDraft } = useStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (!draft) startDraft()
  }, [])

  if (!draft) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-border border-t-accent-green rounded-full animate-spin" />
      </div>
    )
  }

  const next = () => setStep(s => Math.min(s + 1, 7))
  const back = () => setStep(s => Math.max(s - 1, 1))

  const handleDiscard = () => {
    if (confirm('Discard this session? All unsaved data will be lost.')) {
      discardDraft()
      navigate('/')
    }
  }

  const stepProps = { draft, next, back }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      {/* Header row */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-text-primary">New Session</h1>
          <p className="text-sm text-text-muted mt-0.5">{STEP_LABELS[step - 1]}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={handleDiscard} className="text-accent-red hover:text-accent-red hover:bg-accent-red/10">
          Discard
        </Button>
      </div>

      {/* Progress */}
      <ProgressBar
        currentStep={step}
        totalSteps={7}
        stepLabels={STEP_LABELS}
      />

      {/* Step content */}
      <div className="animate-slide-up">
        {step === 1 && <Step1_Participant {...stepProps} />}
        {step === 2 && <Step2_Phase1     {...stepProps} />}
        {step === 3 && <Step3_Phase2     {...stepProps} />}
        {step === 4 && <Step4_Phase3     {...stepProps} />}
        {step === 5 && <Step5_Phase4     {...stepProps} />}
        {step === 6 && <Step6_SUS        {...stepProps} />}
        {step === 7 && <Step7_PostSession {...stepProps} navigate={navigate} />}
      </div>
    </div>
  )
}
