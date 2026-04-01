import React, { useMemo, useState } from 'react'
import { EXERCISE_CATALOG, SPECIAL_CLASSES } from '@/constants'
import { UserProfile, WorkoutCatalogSelection, SpecialDish } from '@/types'

interface GoalsSectionProps {
  profile: UserProfile
  selectedExercises: WorkoutCatalogSelection
  specialDish: SpecialDish | null
  onProfileChange: (patch: Partial<UserProfile>) => void
  onSelectionChange: (selection: WorkoutCatalogSelection) => void
  onSpecialDishChange: (dish: SpecialDish | null) => void
}

const activityMultiplier: Record<string, number> = {
  sedentario: 1.2,
  ligero: 1.375,
  moderado: 1.55,
  activo: 1.725,
  muy_activo: 1.9,
}

export const GoalsSection: React.FC<GoalsSectionProps> = ({
  profile,
  selectedExercises,
  specialDish,
  onProfileChange,
  onSelectionChange,
  onSpecialDishChange,
}) => {
  const [dishForm, setDishForm] = useState<SpecialDish>(
    specialDish || {
      name: 'Arroz + lentejas + tomate + queso feta',
      calories: 390,
      proteins: 18,
      carbs: 49,
      fats: 12,
      prep: 'Combina ingredientes en bowl y ajusta porciones segun objetivo.',
    }
  )

  const plan = useMemo(() => {
    const goalKg = profile.targetKg || 1
    const months = Math.max(profile.targetMonths || 1, 1)
    const weeks = months * 4.345
    const dailyKgChange = goalKg / (months * 30)
    const kcalPerKg = 7700
    const dailyAdjustment = Math.round((goalKg * kcalPerKg) / (months * 30))

    const baseWeight = 78
    const baseHeight = 175
    const baseAge = 30
    const bmr = 10 * baseWeight + 6.25 * baseHeight - 5 * baseAge + 5
    const maintenance = Math.round(bmr * activityMultiplier[profile.activityLevel])

    let targetCalories = maintenance
    if (profile.fitnessGoal === 'perder_grasa') targetCalories = maintenance - dailyAdjustment
    if (profile.fitnessGoal === 'ganar_musculo') targetCalories = maintenance + dailyAdjustment

    const protein = Math.round(baseWeight * (profile.fitnessGoal === 'ganar_musculo' ? 2.2 : 2))
    const fats = Math.round(baseWeight * 0.9)
    const carbs = Math.max(Math.round((targetCalories - protein * 4 - fats * 9) / 4), 120)

    return {
      weeklyDelta: (goalKg / weeks).toFixed(2),
      dailyKgChange: dailyKgChange.toFixed(3),
      maintenance,
      targetCalories,
      macros: { protein, carbs, fats },
    }
  }, [profile])

  const toggleDay = (day: string) => {
    const exists = profile.trainDays.includes(day)
    const next = exists ? profile.trainDays.filter(d => d !== day) : [...profile.trainDays, day]
    onProfileChange({ trainDays: next })
  }

  const togglePriority = (priority: string) => {
    const exists = profile.priorities.includes(priority)
    const next = exists ? profile.priorities.filter(p => p !== priority) : [...profile.priorities, priority]
    onProfileChange({ priorities: next })
  }

  const toggleExercise = (group: keyof WorkoutCatalogSelection, exercise: string) => {
    const groupList = selectedExercises[group]
    const exists = groupList.includes(exercise)
    const nextGroup = exists ? groupList.filter(item => item !== exercise) : [...groupList, exercise]
    onSelectionChange({ ...selectedExercises, [group]: nextGroup })
  }

  const saveSpecialDish = () => {
    onSpecialDishChange(dishForm)
  }

  const profileHighlights = [
    { label: 'Meta', value: profile.fitnessGoal.replace('_', ' ') },
    { label: 'Actividad', value: profile.activityLevel },
    { label: 'Entrenos', value: `${profile.trainDays.length} dias` },
  ]

  return (
    <div>
      <h2 className="rec-title">Plan Personalizado y Configuracion</h2>

      <div className="glass card">
        <h3>Perfil Inicial</h3>
        <p className="section-caption">Ajusta el punto de partida para que dieta y entreno tengan sentido en movil y en seguimiento diario.</p>
        <div className="profile-highlight-grid">
          {profileHighlights.map(item => (
            <div key={item.label} className="summary-item">
              <h4>{item.label}</h4>
              <p>{item.value}</p>
            </div>
          ))}
        </div>
        <div className="metrics-form">
          <select
            className="tool-select"
            value={profile.fitnessGoal}
            onChange={e => onProfileChange({ fitnessGoal: e.target.value as UserProfile['fitnessGoal'] })}
          >
            <option value="perder_grasa">Perder grasa</option>
            <option value="ganar_musculo">Ganar musculo</option>
            <option value="recomposicion">Recomposicion</option>
          </select>

          <select
            className="tool-select"
            value={profile.activityLevel}
            onChange={e => onProfileChange({ activityLevel: e.target.value as UserProfile['activityLevel'] })}
          >
            <option value="sedentario">Sedentario</option>
            <option value="ligero">Ligero</option>
            <option value="moderado">Moderado</option>
            <option value="activo">Activo</option>
            <option value="muy_activo">Muy activo</option>
          </select>

          <input
            type="number"
            className="tool-input"
            placeholder="Pasos diarios"
            value={profile.dailySteps}
            onChange={e => onProfileChange({ dailySteps: Number(e.target.value) || 0 })}
          />

          <select
            className="tool-select"
            value={profile.trainingPlace}
            onChange={e => onProfileChange({ trainingPlace: e.target.value as UserProfile['trainingPlace'] })}
          >
            <option value="casa">Entreno en casa</option>
            <option value="gym">Entreno en gym</option>
            <option value="calle">Entreno en calle</option>
          </select>

          <input
            type="time"
            className="tool-input"
            value={profile.trainTime}
            onChange={e => onProfileChange({ trainTime: e.target.value })}
          />

          <select
            className="tool-select"
            value={profile.specialClass}
            onChange={e => onProfileChange({ specialClass: e.target.value })}
          >
            {SPECIAL_CLASSES.map(item => (
              <option key={item} value={item}>
                {item.split('_').join(' ')}
              </option>
            ))}
          </select>
        </div>

        <div className="rec-item section-space-sm">
          <strong>Dias de entreno:</strong>
          <div className="chip-grid">
            {['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'].map(day => (
              <button
                key={day}
                className={`chip-btn ${profile.trainDays.includes(day) ? 'active' : ''}`}
                type="button"
                onClick={() => toggleDay(day)}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        <div className="rec-item">
          <strong>Prioridades musculares:</strong>
          <div className="chip-grid">
            {['pierna', 'gluteo', 'espalda', 'pecho', 'hombro', 'biceps', 'triceps', 'core'].map(priority => (
              <button
                key={priority}
                className={`chip-btn ${profile.priorities.includes(priority) ? 'active' : ''}`}
                type="button"
                onClick={() => togglePriority(priority)}
              >
                {priority}
              </button>
            ))}
          </div>
        </div>

        <textarea
          className="tool-input section-space-sm"
          placeholder="Patologias o limitaciones de comida"
          value={profile.foodPathologies}
          onChange={e => onProfileChange({ foodPathologies: e.target.value })}
        />
        <textarea
          className="tool-input section-space-sm"
          placeholder="Lesiones/patologias (hernia, dolor lumbar, etc.)"
          value={profile.injuryPathologies}
          onChange={e => onProfileChange({ injuryPathologies: e.target.value })}
        />
      </div>

      <div className="glass card">
        <h3>Objetivo por Kilos y Tiempo</h3>
        <div className="metrics-form">
          <input
            type="number"
            className="tool-input"
            placeholder="Kilos objetivo"
            value={profile.targetKg}
            onChange={e => onProfileChange({ targetKg: Number(e.target.value) || 0 })}
          />
          <input
            type="number"
            className="tool-input"
            placeholder="Meses"
            value={profile.targetMonths}
            onChange={e => onProfileChange({ targetMonths: Number(e.target.value) || 1 })}
          />
        </div>

        <div className="summary-grid goals-summary-grid">
          <div className="summary-item">
            <h4>Kg/semana</h4>
            <p>{plan.weeklyDelta}</p>
          </div>
          <div className="summary-item">
            <h4>Kg/dia</h4>
            <p>{plan.dailyKgChange}</p>
          </div>
          <div className="summary-item">
            <h4>Mantenimiento</h4>
            <p>{plan.maintenance} kcal</p>
          </div>
          <div className="summary-item">
            <h4>Objetivo kcal</h4>
            <p>{plan.targetCalories} kcal</p>
          </div>
        </div>

        <p className="section-caption section-space-sm">
          Macros sugeridos: {plan.macros.protein}g P / {plan.macros.carbs}g C / {plan.macros.fats}g G
        </p>
      </div>

      <div className="glass card">
        <h3>Plato Especial Personalizado</h3>
        <p className="section-caption">Este bloque debe ser rápido de editar en móvil y fácil de escanear al cocinar.</p>
        <div className="metrics-form">
          <input
            type="text"
            className="tool-input"
            placeholder="Nombre del plato"
            value={dishForm.name}
            onChange={e => setDishForm({ ...dishForm, name: e.target.value })}
          />
          <input
            type="number"
            className="tool-input"
            placeholder="Calorias"
            value={dishForm.calories}
            onChange={e => setDishForm({ ...dishForm, calories: Number(e.target.value) || 0 })}
          />
          <input
            type="number"
            className="tool-input"
            placeholder="Proteinas"
            value={dishForm.proteins}
            onChange={e => setDishForm({ ...dishForm, proteins: Number(e.target.value) || 0 })}
          />
          <input
            type="number"
            className="tool-input"
            placeholder="Carbohidratos"
            value={dishForm.carbs}
            onChange={e => setDishForm({ ...dishForm, carbs: Number(e.target.value) || 0 })}
          />
          <input
            type="number"
            className="tool-input"
            placeholder="Grasas"
            value={dishForm.fats}
            onChange={e => setDishForm({ ...dishForm, fats: Number(e.target.value) || 0 })}
          />
        </div>
        <textarea
          className="tool-input"
          placeholder="Preparacion"
          value={dishForm.prep}
          onChange={e => setDishForm({ ...dishForm, prep: e.target.value })}
        />
        <button type="button" className="tool-btn btn-shine" onClick={saveSpecialDish}>
          Guardar plato especial
        </button>
      </div>

      <div className="glass card">
        <h3>Catalogo de ejercicios (15-20 por grupo)</h3>
        <p className="section-caption">Abre solo los grupos que realmente priorizas para no saturar la pantalla pequeña.</p>
        {Object.entries(EXERCISE_CATALOG).map(([group, exercises]) => (
          <details key={group} className="tip-category" open={profile.priorities.includes(group)}>
            <summary>{group.toUpperCase()}</summary>
            <div className="chip-grid">
              {exercises.map(exercise => (
                <button
                  key={exercise}
                  className={`chip-btn ${selectedExercises[group as keyof WorkoutCatalogSelection].includes(exercise) ? 'active' : ''}`}
                  type="button"
                  onClick={() => toggleExercise(group as keyof WorkoutCatalogSelection, exercise)}
                >
                  {exercise}
                </button>
              ))}
            </div>
          </details>
        ))}
      </div>
    </div>
  )
}
