import Chip from './Chip.jsx'
import { OBSERVATION_TAGS } from '../../data/questions.js'

const TAG_ICONS = {
  confusion: '😕',
  delight:   '✨',
  error:     '⚠',
  question:  '?',
}

/**
 * Multiselect observation tag bar.
 * Props:
 *  selected  — string[]
 *  onChange  — (tags: string[]) => void
 */
export default function TagBar({ selected = [], onChange }) {
  const toggle = (tag) => {
    const next = selected.includes(tag)
      ? selected.filter(t => t !== tag)
      : [...selected, tag]
    onChange(next)
  }

  return (
    <div className="flex flex-wrap gap-2">
      {OBSERVATION_TAGS.map(tag => (
        <Chip
          key={tag}
          label={`${TAG_ICONS[tag]} ${tag}`}
          selected={selected.includes(tag)}
          variant={tag}
          onClick={() => toggle(tag)}
        />
      ))}
    </div>
  )
}
