import { memo, useMemo } from 'react'

const FRUIT_CONFIG = {
  apple: {
    label: 'Red Apple',
    subtitle: 'Fuji variety',
    bgColor: 'bg-red-900/30',
    textColor: 'text-red-500',
  },
  banana: {
    label: 'Banana',
    subtitle: 'Cavendish',
    bgColor: 'bg-yellow-900/30',
    textColor: 'text-yellow-500',
  },
  orange: {
    label: 'Orange',
    subtitle: 'Navel',
    bgColor: 'bg-orange-900/30',
    textColor: 'text-orange-500',
  },
}

const DEFAULT_CONFIG = {
  label: '',
  subtitle: 'Detected fruit',
  bgColor: 'bg-green-900/30',
  textColor: 'text-green-500',
}

function DetectedFruitsInner({ detections }) {
  const fruitCounts = useMemo(() => {
    const counts = {}
    for (const d of detections) {
      const name = d.fruit_name || d.fruit
      counts[name] = (counts[name] || 0) + 1
    }
    return counts
  }, [detections])

  const fruitEntries = Object.entries(fruitCounts)
  const totalItems = fruitEntries.reduce((sum, [, count]) => sum + count, 0)

  return (
    <div className="bg-card-dark rounded-xl p-5 border border-border-dark shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">inventory_2</span>
          Detected Fruits
        </h3>
        <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-bold">
          {totalItems} item{totalItems !== 1 ? 's' : ''}
        </span>
      </div>
      <div className="space-y-3">
        {fruitEntries.length === 0 && (
          <div className="text-sm text-white/40 text-center py-4">
            No fruits detected yet. Start the camera to begin.
          </div>
        )}
        {fruitEntries.map(([name, count]) => {
          const config = FRUIT_CONFIG[name] || {
            ...DEFAULT_CONFIG,
            label: name.charAt(0).toUpperCase() + name.slice(1),
          }
          return (
            <div
              key={name}
              className="flex items-center justify-between p-3 rounded-lg bg-border-dark border border-white/5"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`size-10 rounded ${config.bgColor} flex items-center justify-center ${config.textColor}`}
                >
                  <span className="material-symbols-outlined">nutrition</span>
                </div>
                <div>
                  <p className="font-bold text-sm">{config.label}</p>
                  <p className="text-xs opacity-60">{config.subtitle}</p>
                </div>
              </div>
              <p className="font-bold text-primary">x{count}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export const DetectedFruits = memo(DetectedFruitsInner)
