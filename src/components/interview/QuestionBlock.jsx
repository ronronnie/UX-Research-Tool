import Textarea from '../ui/Textarea.jsx'
import PresetChips from '../ui/PresetChips.jsx'
import ScaleButtons from '../ui/ScaleButtons.jsx'
import TagBar from '../ui/TagBar.jsx'

/**
 * Reusable question block for Phase 1 & Phase 2 wizard steps.
 *
 * Props:
 *  question   — question definition from questions.js
 *  response   — { answer_text, presets_selected, scale_value, tags }
 *  onChange   — (updates) => void
 *  index      — display number (1-based)
 */
export default function QuestionBlock({ question, response, onChange, index }) {
  const handlePresetToggle = (preset) => {
    const already = response.presets_selected.includes(preset)
    const next = already
      ? response.presets_selected.filter(p => p !== preset)
      : [...response.presets_selected, preset]

    // Also append preset text into answer_text if not already there
    let text = response.answer_text ?? ''
    if (!already && !text.toLowerCase().includes(preset.toLowerCase())) {
      text = text ? `${text.trim()}, ${preset}` : preset
    }

    onChange({ presets_selected: next, answer_text: text })
  }

  return (
    <div className="flex flex-col gap-3 p-4 bg-bg-secondary rounded-xl border border-border">
      {/* Question header */}
      <div className="flex items-start gap-3">
        <span className="min-w-[24px] h-6 flex items-center justify-center rounded-full
                         bg-accent-green/15 text-accent-green text-xs font-bold">
          {index}
        </span>
        <p className="text-sm font-medium text-text-primary leading-relaxed">{question.text}</p>
      </div>

      {/* Scale buttons (e.g. p1q5) */}
      {question.type === 'scale' && (
        <ScaleButtons
          min={question.min ?? 1}
          max={question.max ?? 5}
          value={response.scale_value}
          onChange={v => onChange({ scale_value: v })}
          startLabel="Very low"
          endLabel="Very high"
          colorScale
        />
      )}

      {/* Text input for non-scale questions */}
      {question.type !== 'scale' && (
        <Textarea
          placeholder="Type participant response…"
          value={response.answer_text ?? ''}
          onChange={e => onChange({ answer_text: e.target.value })}
          rows={2}
        />
      )}

      {/* Preset chips */}
      {question.presets?.length > 0 && (
        <PresetChips
          presets={question.presets}
          selected={response.presets_selected ?? []}
          onToggle={handlePresetToggle}
        />
      )}

      {/* Observation tags */}
      {question.hasTags && (
        <div className="pt-1 border-t border-border/50">
          <p className="text-xs text-text-muted mb-2">Observation tags</p>
          <TagBar
            selected={response.tags ?? []}
            onChange={tags => onChange({ tags })}
          />
        </div>
      )}
    </div>
  )
}
