import { DIET_DATA } from '@/constants/dietData'
import { Meal, SpecialDish } from '@/types'

export const buildDayMeals = (currentDay: string, specialDish: SpecialDish | null): Meal[] => {
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

  return dayMeals
}