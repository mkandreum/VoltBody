import React from 'react'
import { WORKOUT_DATA } from '@/constants/workoutData'
import { DAY_NAMES } from '@/constants'
import { Exercise } from '@/types'

interface WorkoutSectionProps {
  currentDay: string
  workoutInputs: Record<string, { weight: string; rpe: string }>
  customExercises?: Exercise[]
  specialClass?: string
  onInputChange: (key: string, field: 'weight' | 'rpe', value: string) => void
  onSaveProgress: () => void
  onShowExerciseGuide: (exerciseName: string) => void
}

export const WorkoutSection: React.FC<WorkoutSectionProps> = ({
  currentDay,
  workoutInputs,
  customExercises,
  specialClass,
  onInputChange,
  onSaveProgress,
  onShowExerciseGuide,
}) => {
  const workout = WORKOUT_DATA[currentDay]
  if (!workout) return null
  const exercisesToShow = customExercises && customExercises.length > 0 ? customExercises : workout.exercises

  const calculate1RM = (weight: string, reps: string): string => {
    const w = parseFloat(weight)
    const r = parseInt(reps.split('-')[0])
    if (w > 0 && r > 0) {
      return `1RM est: ${(w * (1 + r / 30)).toFixed(1)}kg`
    }
    return ''
  }

  return (
    <div className="glass card">
      <div className="card-header">
        <div className="workout-type">{workout.type}</div>
        <div className="workout-time">{workout.duration}</div>
      </div>

      {specialClass && currentDay === 'jueves' && (
        <div className="rec-item" style={{ marginBottom: '16px', borderLeftColor: 'var(--neon-yellow)' }}>
          <strong>Clase Especial:</strong> {specialClass.split('_').join(' ')}
        </div>
      )}

      <div className="exercises">
        {exercisesToShow
          .filter((ex: Exercise) => ex.sets)
          .map((exercise: Exercise, index: number) => {
            const inputKey = `${currentDay}_${exercise.name}`
            const input = workoutInputs[inputKey] || { weight: '', rpe: '' }

            return (
              <div key={index} className="exercise-item">
                <div className="exercise-details">
                  <div
                    className="exercise-name"
                    onClick={() => onShowExerciseGuide(exercise.name)}
                  >
                    💪 {exercise.name}
                  </div>
                  <div className="exercise-sets">{exercise.sets}x{exercise.reps}</div>
                  <div className="onerm-estimate">
                    {calculate1RM(input.weight, exercise.reps)}
                  </div>
                </div>
                <div className="weight-rpe-group">
                  <input
                    type="number"
                    className="weight-input"
                    placeholder="kg"
                    value={input.weight}
                    onChange={e => onInputChange(inputKey, 'weight', e.target.value)}
                  />
                  <select
                    className="rpe-select"
                    value={input.rpe}
                    onChange={e => onInputChange(inputKey, 'rpe', e.target.value)}
                  >
                    <option value="" disabled>
                      RPE
                    </option>
                    {[6, 7, 8, 9, 10].map(rpe => (
                      <option key={rpe} value={rpe}>
                        {rpe}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )
          })}
      </div>

      {workout.core && (
        <div className="rec-item" style={{ marginTop: '20px', borderLeftColor: 'var(--neon-pink)' }}>
          <strong>🎯 Core:</strong> {workout.core}
        </div>
      )}

      <button className="workout-save-btn btn-shine" onClick={onSaveProgress}>
        💾 Guardar
      </button>
    </div>
  )
}
