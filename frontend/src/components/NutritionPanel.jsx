import { memo, useState, useEffect, useMemo } from 'react'
import { fetchBulkNutrition } from '../services/api'

const DAILY_VALUES = {
  vitamin_c_mg: 90,
  potassium_mg: 4700,
  fiber_g: 28,
  iron_mg: 18,
  magnesium_mg: 420,
  vitamin_a_mcg: 900,
}

function NutritionPanelInner({ detectedFruits }) {
  const [nutritionData, setNutritionData] = useState({})

  // Stable key: sorted unique fruit names so the effect only re-runs when
  // the set of detected fruits actually changes, not on every frame.
  const uniqueFruits = useMemo(() => [...new Set(detectedFruits)].sort(), [detectedFruits])
  const fruitsKey = uniqueFruits.join(',')

  useEffect(() => {
    if (uniqueFruits.length === 0) {
      setNutritionData({})
      return
    }

    let cancelled = false

    const timer = setTimeout(async () => {
      try {
        const data = await fetchBulkNutrition(uniqueFruits)
        if (!cancelled) {
          setNutritionData(data)
        }
      } catch {
        // ignore fetch errors
      }
    }, 300)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [fruitsKey])

  const totals = useMemo(() => {
    const result = {
      calories: 0,
      protein_g: 0,
      carbs_g: 0,
      fat_g: 0,
      fiber_g: 0,
      sugar_g: 0,
      vitamin_c_mg: 0,
      potassium_mg: 0,
      iron_mg: 0,
    }

    for (const fruit of detectedFruits) {
      const info = nutritionData[fruit]
      if (!info) continue
      result.calories += info.calories || 0
      result.protein_g += info.protein_g || 0
      result.carbs_g += info.carbs_g || 0
      result.fat_g += info.fat_g || 0
      result.fiber_g += info.fiber_g || 0
      result.sugar_g += info.sugar_g || 0
      result.vitamin_c_mg += info.vitamin_c_mg || 0
      result.potassium_mg += info.potassium_mg || 0
      result.iron_mg += info.iron_mg || 0
    }

    return result
  }, [detectedFruits, nutritionData])

  const macroTotal = totals.carbs_g + totals.fat_g + totals.protein_g
  const carbsPct = macroTotal > 0 ? Math.round((totals.carbs_g / macroTotal) * 100) : 0
  const fatsPct = macroTotal > 0 ? Math.round((totals.fat_g / macroTotal) * 100) : 0
  const protPct = macroTotal > 0 ? 100 - carbsPct - fatsPct : 0

  const carbsDash = (carbsPct / 100) * 100
  const fatsDash = (fatsPct / 100) * 100
  const protDash = (protPct / 100) * 100

  const vitCPct = Math.min(100, Math.round((totals.vitamin_c_mg / DAILY_VALUES.vitamin_c_mg) * 100))
  const potPct = Math.min(100, Math.round((totals.potassium_mg / DAILY_VALUES.potassium_mg) * 100))
  const fiberPct = Math.min(100, Math.round((totals.fiber_g / DAILY_VALUES.fiber_g) * 100))

  return (
    <div className="flex-1 bg-card-dark rounded-xl p-5 border border-border-dark shadow-sm flex flex-col">
      <h3 className="font-bold text-lg flex items-center gap-2 mb-6">
        <span className="material-symbols-outlined text-primary">analytics</span>
        Total Nutrition
      </h3>

      <div className="relative size-48 mx-auto mb-8">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
          <circle
            className="stroke-border-dark"
            cx="18"
            cy="18"
            fill="none"
            r="16"
            strokeWidth="4"
          />
          {macroTotal > 0 && (
            <>
              <circle
                className="stroke-primary transition-all duration-500"
                cx="18"
                cy="18"
                fill="none"
                r="16"
                strokeDasharray={`${carbsDash}, 100`}
                strokeWidth="4"
              />
              <circle
                className="stroke-yellow-400 transition-all duration-500"
                cx="18"
                cy="18"
                fill="none"
                r="16"
                strokeDasharray={`${fatsDash}, 100`}
                strokeDashoffset={`${-carbsDash}`}
                strokeWidth="4"
              />
              <circle
                className="stroke-blue-400 transition-all duration-500"
                cx="18"
                cy="18"
                fill="none"
                r="16"
                strokeDasharray={`${protDash}, 100`}
                strokeDashoffset={`${-(carbsDash + fatsDash)}`}
                strokeWidth="4"
              />
            </>
          )}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold">{Math.round(totals.calories)}</span>
          <span className="text-[10px] uppercase opacity-60 tracking-widest">Calories</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-8 text-[11px] font-bold uppercase tracking-tight">
        <div className="flex flex-col items-center gap-1">
          <div className="size-2 rounded-full bg-primary" />
          <span>Carbs ({carbsPct}%)</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="size-2 rounded-full bg-yellow-400" />
          <span>Fats ({fatsPct}%)</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="size-2 rounded-full bg-blue-400" />
          <span>Prot ({protPct}%)</span>
        </div>
      </div>

      <div className="space-y-4 flex-1">
        <ProgressBar label="Vitamin C" value={vitCPct} />
        <ProgressBar label="Potassium" value={potPct} />
        <ProgressBar label="Fiber" value={fiberPct} />
      </div>

      <button className="w-full mt-6 py-3 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors">
        Export Full Report
      </button>
    </div>
  )
}

function ProgressBar({ label, value }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs font-medium">
        <span>{label}</span>
        <span className="text-primary">{value}% DV</span>
      </div>
      <div className="h-2 w-full bg-border-dark rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}

export const NutritionPanel = memo(NutritionPanelInner)
