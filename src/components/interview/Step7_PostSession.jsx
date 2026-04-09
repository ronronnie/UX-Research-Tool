import { Button, Card } from '../ui/index.js'

export default function Step7_PostSession({ draft, next, back, navigate }) {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <p className="text-text-muted text-sm">Step 7 — Post-session Scores (coming in Module 5)</p>
      </Card>
      <div className="flex items-center justify-between">
        <Button variant="secondary" onClick={back}>← Back</Button>
        <Button onClick={() => navigate('/')}>Save & Complete</Button>
      </div>
    </div>
  )
}
