import React, { useState } from 'react'
import { DIET_DATA } from '@/constants/dietData'
import { DAY_NAMES, MACRO_NAMES } from '@/constants'
import { Meal, SpecialDish } from '@/types'

interface DietSectionProps {
  currentDay: string
  specialDish: SpecialDish | null
  onMealCheck: (mealId: string, checked: boolean) => void
  isMealChecked: (mealId: string) => boolean
}

export const DietSection: React.FC<DietSectionProps> = ({ currentDay, specialDish, onMealCheck, isMealChecked }) => {
  const [alternatives, setAlternatives] = useState<Record<number, number>>({})

  const baseMeals = DIET_DATA[currentDay] || []
  const dayMeals: Meal[] = [...baseMeals]

  const hasAlmuerzo = dayMeals.some(meal => meal.time.toLowerCase().includes('almuerzo'))
  if (!hasAlmuerzo) {
    dayMeals.splice(1, 0, {
      time: 'Almuerzo (11:30)',
      calories: 390,
      foods: 'Yogur griego + fruta + frutos secos',
      macros: { p: 25, c: 35, f: 14 },
      prep: 'Bloque intermedio para evitar llegar con hambre a la comida principal.',
    })
  }

  if (specialDish) {
    dayMeals.splice(2, 0, {
      time: 'Plato Especial (Personalizado)',
      calories: specialDish.calories,
      foods: specialDish.name,
      macros: { p: specialDish.proteins, c: specialDish.carbs, f: specialDish.fats },
      prep: specialDish.prep,
    })
  }

  const handleCycleAlternative = (mealIndex: number) => {
    const currentAlt = alternatives[mealIndex] ?? -1
    const meal = dayMeals[mealIndex]
    const alternatives_count = meal.alternatives?.length || 0
    let nextAlt = currentAlt + 1
    if (nextAlt >= alternatives_count) {
      nextAlt = -1
    }
    setAlternatives(prev => ({ ...prev, [mealIndex]: nextAlt }))
  }

  const renderMealContent = (meal: Meal, altIndex: number) => {
    const mealToShow = altIndex === -1 ? meal : meal.alternatives?.[altIndex]
    if (!mealToShow) return null

    return (
      <>
        <p className="meal-foods">{mealToShow.foods}</p>
        <div className="macros">
          {Object.entries(mealToShow.macros).map(([key, value]) => (
            <span key={key} className="macro">
              {value}g {MACRO_NAMES[key as keyof typeof MACRO_NAMES]}
            </span>
          ))}
        </div>
        <p className="preparation">{mealToShow.prep}</p>
      </>
    )
  }

  const totalCalories = dayMeals.reduce((sum, meal) => sum + meal.calories, 0)
  const totalProtein = dayMeals.reduce((sum, meal) => sum + meal.macros.p, 0)
  const totalCarbs = dayMeals.reduce((sum, meal) => sum + meal.macros.c, 0)
  const totalFats = dayMeals.reduce((sum, meal) => sum + meal.macros.f, 0)

  return (
    <div>
      <div className="glass card summary-card">
        <h3 className="summary-title">Resumen del Día: {DAY_NAMES[currentDay]}</h3>
        <div className="summary-grid">
          <div className="summary-item">
            <h4>⚡ Calorías</h4>
            <p>~{totalCalories} kcal</p>
          </div>
          <div className="summary-item">
            <h4>🍗 {MACRO_NAMES.p}</h4>
            <p>~{totalProtein} g</p>
          </div>
          <div className="summary-item">
            <h4>🍚 {MACRO_NAMES.c}</h4>
            <p>~{totalCarbs} g</p>
          </div>
          <div className="summary-item">
            <h4>🥑 {MACRO_NAMES.f}</h4>
            <p>~{totalFats} g</p>
          </div>
        </div>
      </div>

      {dayMeals.map((meal, index) => {
        const mealId = `${currentDay}-meal-${index}`
        const isChecked = isMealChecked(mealId)
        const isCompleted = isChecked ? 'completed' : ''
        const hasAlternatives = meal.alternatives && meal.alternatives.length > 0
        const currentAlt = alternatives[index] ?? -1

        return (
          <div key={index} className={`glass card meal-card ${isCompleted}`} id={`meal-card-${index}`}>
            <div className="card-header">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="checkbox"
                  className="meal-check"
                  id={`meal-check-${index}`}
                  checked={isChecked}
                  onChange={e => onMealCheck(mealId, e.target.checked)}
                />
                <label htmlFor={`meal-check-${index}`} className="meal-time">
                  {meal.time}
                </label>
              </div>
              <div className="meal-calories">{dayMeals[index].calories} kcal</div>
            </div>
            <div className="meal-content-wrapper">{renderMealContent(meal, currentAlt)}</div>
            {hasAlternatives && (
              <button
                className="alt-meal-btn btn-shine"
                onClick={() => handleCycleAlternative(index)}
              >
                {currentAlt === -1 ? 'Plato Alternativo' : `Alternativa ${currentAlt + 1}/${meal.alternatives?.length}`}
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}
