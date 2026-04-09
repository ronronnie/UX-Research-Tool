import clsx from 'clsx'

/**
 * Wizard progress bar.
 * Props: currentStep (1-based), totalSteps, stepLabels (optional string[])
 */
export default function ProgressBar({ currentStep, totalSteps, stepLabels = [] }) {
  const pct = Math.round(((currentStep - 1) / (totalSteps - 1)) * 100)

  return (
    <div className="flex flex-col gap-2 mb-6">
      {/* Step counter */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-text-secondary">
          Step {currentStep} of {totalSteps}
        </span>
        {stepLabels[currentStep - 1] && (
          <span className="text-xs font-semibold text-accent-green">
            {stepLabels[currentStep - 1]}
          </span>
        )}
      </div>

      {/* Bar track */}
      <div className="h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
        <div
          className="h-full bg-accent-green rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Step dots */}
      <div className="flex justify-between">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className={clsx(
              'w-2 h-2 rounded-full transition-all duration-300',
              i + 1 < currentStep  && 'bg-accent-green',
              i + 1 === currentStep && 'bg-accent-green scale-125',
              i + 1 > currentStep  && 'bg-border'
            )}
          />
        ))}
      </div>
    </div>
  )
}
