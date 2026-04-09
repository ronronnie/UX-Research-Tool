import Chip from './Chip.jsx'

/**
 * Renders a row of preset answer chips.
 *
 * Props:
 *  presets        — string[]
 *  selected       — string[]  (currently selected preset labels)
 *  onToggle       — (preset: string) => void
 *  onAppendText   — (preset: string) => void  (optional: appends to a text field)
 */
export default function PresetChips({ presets = [], selected = [], onToggle, onAppendText }) {
  if (!presets.length) return null

  const handleClick = (preset) => {
    if (onToggle) onToggle(preset)
    if (onAppendText) onAppendText(preset)
  }

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {presets.map(preset => (
        <Chip
          key={preset}
          label={preset}
          selected={selected.includes(preset)}
          onClick={() => handleClick(preset)}
        />
      ))}
    </div>
  )
}
