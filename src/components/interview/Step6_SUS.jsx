import { Button, Card } from '../ui/index.js'

export default function Step6_SUS({ draft, next, back }) {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <p className="text-text-muted text-sm">Step 6 — SUS Questionnaire (coming in Module 5)</p>
      </Card>
      <div className="flex items-center justify-between">
        <Button variant="secondary" onClick={back}>← Back</Button>
        <Button onClick={next}>Continue →</Button>
      </div>
    </div>
  )
}
