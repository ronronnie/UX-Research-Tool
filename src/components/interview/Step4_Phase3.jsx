import { useState, useEffect, useRef } from 'react'
import { useStore } from '../../store/useStore.js'
import { Button, Card, Stepper, Slider, TagBar, Textarea, Input } from '../ui/index.js'
import PresetChips from '../ui/PresetChips.jsx'
import { TASKS } from '../../data/questions.js'
import clsx from 'clsx'

// ── Stopwatch ─────────────────────────────────────────────────────────────────
function Stopwatch({ seconds, onChange }) {
  const [running, setRunning] = useState(false)
  const [liveExtra, setLiveExtra] = useState(0)
  const startedAtRef = useRef(null)
  const intervalRef = useRef(null)

  useEffect(() => {
    return () => clearInterval(intervalRef.current)
  }, [])

  const start = () => {
    startedAtRef.current = Date.now()
    setLiveExtra(0)
    setRunning(true)
    intervalRef.current = setInterval(() => {
      setLiveExtra(Math.round((Date.now() - startedAtRef.current) / 1000))
    }, 500)
  }

  const stop = () => {
    clearInterval(intervalRef.current)
    const extra = Math.round((Date.now() - startedAtRef.current) / 1000)
    onChange(seconds + extra)
    setLiveExtra(0)
    setRunning(false)
  }

  const reset = () => {
    clearInterval(intervalRef.current)
    setRunning(false)
    setLiveExtra(0)
    onChange(0)
  }

  const total = seconds + (running ? liveExtra : 0)
  const mm = String(Math.floor(total / 60)).padStart(2, '0')
  const ss = String(total % 60).padStart(2, '0')

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-text-secondary">Time on task</span>
      <div className="flex items-center gap-2">
        <div className={clsx(
          'font-mono text-lg font-bold px-3 py-1.5 rounded-lg border min-w-[80px] text-center',
          running ? 'border-accent-green text-accent-green bg-accent-green/10' : 'border-border text-text-primary bg-bg-tertiary'
        )}>
          {mm}:{ss}
        </div>
        {!running ? (
          <Button size="sm" variant="secondary" onClick={start}>▶ Start</Button>
        ) : (
          <Button size="sm" onClick={stop}>■ Stop</Button>
        )}
        {!running && total > 0 && (
          <Button size="sm" variant="ghost" onClick={reset}>Reset</Button>
        )}
      </div>
    </div>
  )
}

// ── Completed Toggle ──────────────────────────────────────────────────────────
function CompletedToggle({ value, onChange }) {
  const options = [
    { key: 'yes',     label: '✓ Completed',  active: 'border-accent-green text-accent-green bg-accent-green/10' },
    { key: 'partial', label: '~ Partial',     active: 'border-accent-amber text-accent-amber bg-accent-amber/10' },
    { key: 'no',      label: '✗ Not done',   active: 'border-accent-red text-accent-red bg-accent-red/10' },
  ]
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-text-secondary">Completion</span>
      <div className="flex gap-2 flex-wrap">
        {options.map(o => (
          <button
            key={o.key}
            type="button"
            onClick={() => onChange(o.key)}
            className={clsx(
              'px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all',
              value === o.key
                ? o.active
                : 'border-border text-text-muted bg-bg-tertiary hover:border-border-light hover:text-text-primary'
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Post-task Question ────────────────────────────────────────────────────────
function PostTaskQuestion({ question, response, onChange, index }) {
  const handlePreset = (preset) => {
    const already = response.presets_selected.includes(preset)
    const next = already
      ? response.presets_selected.filter(p => p !== preset)
      : [...response.presets_selected, preset]
    let text = response.answer_text ?? ''
    if (!already && !text.toLowerCase().includes(preset.toLowerCase())) {
      text = text ? `${text.trim()}, ${preset}` : preset
    }
    onChange({ presets_selected: next, answer_text: text })
  }

  return (
    <div className="flex flex-col gap-2 p-3 bg-bg-primary rounded-lg border border-border/50">
      <div className="flex items-start gap-2">
        <span className="text-xs font-bold text-text-muted min-w-[18px]">{index}.</span>
        <p className="text-xs font-medium text-text-secondary leading-relaxed">{question.text}</p>
      </div>
      <Textarea
        placeholder="Participant response…"
        value={response.answer_text ?? ''}
        onChange={e => onChange({ answer_text: e.target.value })}
        rows={2}
      />
      {question.presets?.length > 0 && (
        <PresetChips
          presets={question.presets}
          selected={response.presets_selected ?? []}
          onToggle={handlePreset}
        />
      )}
    </div>
  )
}

// ── Task Card ─────────────────────────────────────────────────────────────────
function TaskCard({ taskDef, task, onUpdate }) {
  return (
    <div className="flex flex-col gap-4 p-5 bg-bg-secondary rounded-xl border border-border">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="w-8 h-8 rounded-lg bg-accent-green/15 text-accent-green font-bold text-sm flex items-center justify-center">
          {taskDef.id}
        </span>
        <div>
          <p className="text-sm font-semibold text-text-primary">{taskDef.title}</p>
          <p className="text-xs text-text-muted">{taskDef.description}</p>
        </div>
      </div>

      {/* Row 1: Completion + Stopwatch */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <CompletedToggle
          value={task.completed}
          onChange={v => onUpdate({ completed: v })}
        />
        <Stopwatch
          seconds={task.time_seconds ?? 0}
          onChange={s => onUpdate({ time_seconds: s })}
        />
      </div>

      {/* Row 2: Error count + SEQ score */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Stepper
          label="Error count"
          value={task.error_count ?? 0}
          onChange={v => onUpdate({ error_count: v })}
          min={0}
          max={20}
        />
        <Slider
          label="SEQ score"
          min={1}
          max={7}
          value={task.seq_score}
          onChange={v => onUpdate({ seq_score: v })}
          startLabel="Very difficult"
          endLabel="Very easy"
          showValue
        />
      </div>

      {/* Drop-off screen */}
      {task.completed !== 'yes' && (
        <Input
          label="Drop-off screen (where did they stop?)"
          placeholder="e.g. Invite friends screen"
          value={task.drop_off_screen ?? ''}
          onChange={e => onUpdate({ drop_off_screen: e.target.value })}
        />
      )}

      {/* Tags + Notes */}
      <div className="flex flex-col gap-2 pt-2 border-t border-border/50">
        <p className="text-xs text-text-muted">Observation tags</p>
        <TagBar
          selected={task.tags ?? []}
          onChange={tags => onUpdate({ tags })}
        />
      </div>
      <Textarea
        label="Moderator notes"
        placeholder="Observations, verbatim quotes, anything worth capturing…"
        value={task.notes ?? ''}
        onChange={e => onUpdate({ notes: e.target.value })}
        rows={2}
      />

      {/* Post-task questions */}
      <div className="flex flex-col gap-3 pt-3 border-t border-border/50">
        <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide">Post-task questions</p>
        {taskDef.postTaskQuestions.map((q, i) => (
          <PostTaskQuestion
            key={q.id}
            question={q}
            response={task.post_task?.[i] ?? { question_id: q.id, answer_text: '', presets_selected: [] }}
            onChange={updates => {
              const pt = [...(task.post_task ?? taskDef.postTaskQuestions.map(pq => ({ question_id: pq.id, answer_text: '', presets_selected: [] })))]
              pt[i] = { ...pt[i], ...updates }
              onUpdate({ post_task: pt })
            }}
            index={i + 1}
          />
        ))}
      </div>
    </div>
  )
}

// ── Step 4 ────────────────────────────────────────────────────────────────────
const emptyTask = (taskDef) => ({
  task_id: taskDef.id,
  completed: null,
  time_seconds: 0,
  error_count: 0,
  seq_score: null,
  drop_off_screen: '',
  tags: [],
  notes: '',
  post_task: taskDef.postTaskQuestions.map(q => ({
    question_id: q.id,
    answer_text: '',
    presets_selected: [],
  })),
})

export default function Step4_Phase3({ draft, next, back }) {
  const { updateDraftPhase3 } = useStore()
  const skillLevel = draft.participant?.skill_level ?? 'beginner'

  const applicableTasks = TASKS.filter(t => t.skillLevels.includes(skillLevel))

  const [tasks, setTasks] = useState(() => {
    if (draft.phase3?.length) {
      // Merge existing draft data with applicable tasks
      return applicableTasks.map(taskDef => {
        const existing = draft.phase3.find(t => t.task_id === taskDef.id)
        return existing ?? emptyTask(taskDef)
      })
    }
    return applicableTasks.map(emptyTask)
  })

  const updateTask = (taskId, updates) => {
    const next = tasks.map(t => t.task_id === taskId ? { ...t, ...updates } : t)
    setTasks(next)
    updateDraftPhase3(next)
  }

  return (
    <div className="flex flex-col gap-6">
      <Card padding="sm">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-xs font-bold px-2 py-0.5 rounded bg-accent-green/15 text-accent-green">Phase 3</span>
          <h2 className="text-base font-semibold text-text-primary">Task Flows</h2>
        </div>
        <p className="text-xs text-text-muted">
          {applicableTasks.length} task{applicableTasks.length !== 1 ? 's' : ''} for{' '}
          <span className="font-semibold capitalize">{skillLevel}</span> level.
          {skillLevel === 'beginner' && ' Task B (Tournament) is skipped for beginners.'}
        </p>
      </Card>

      <div className="flex flex-col gap-5">
        {applicableTasks.map(taskDef => {
          const task = tasks.find(t => t.task_id === taskDef.id) ?? emptyTask(taskDef)
          return (
            <TaskCard
              key={taskDef.id}
              taskDef={taskDef}
              task={task}
              onUpdate={updates => updateTask(taskDef.id, updates)}
            />
          )
        })}
      </div>

      {/* Nav */}
      <div className="flex items-center justify-between">
        <Button variant="secondary" onClick={back}>← Back</Button>
        <Button onClick={next}>Continue →</Button>
      </div>
    </div>
  )
}
