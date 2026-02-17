import React from 'react'
import { TIPS_CATEGORIES, DAILY_TIPS } from '@/constants'

interface TipsSectionProps {
  onShowModal: (content: string) => void
}

export const TipsSection: React.FC<TipsSectionProps> = ({ onShowModal }) => {
  const getTodayTip = () => {
    const startDate = new Date('2024-01-01')
    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    const tipIndex = dayOfYear % DAILY_TIPS.length
    return DAILY_TIPS[tipIndex]
  }

  const todayTip = getTodayTip()

  const calculateCalories = () => {
    const gender = (document.getElementById('gender') as HTMLSelectElement)?.value
    const age = parseFloat((document.getElementById('age') as HTMLInputElement)?.value)
    const weight = parseFloat((document.getElementById('weight-cal') as HTMLInputElement)?.value)
    const height = parseFloat((document.getElementById('height') as HTMLInputElement)?.value)
    const activity = parseFloat((document.getElementById('activity') as HTMLSelectElement)?.value)

    if (!age || !weight || !height) return

    let bmr: number
    if (gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161
    }

    const maintenance = Math.round(bmr * activity)
    const deficit = maintenance - 400
    const surplus = maintenance + 400

    const resultDiv = document.getElementById('calorie-result')
    if (resultDiv) {
      resultDiv.innerHTML = `
        <p>Mantenimiento: ~${maintenance} kcal/día</p>
        <p style="color: var(--neon-red);">Déficit (perder): ~${deficit} kcal/día</p>
        <p style="color: var(--neon-green);">Superávit (ganar): ~${surplus} kcal/día</p>
      `
    }
  }

  const calculateTool1RM = () => {
    const weight = parseFloat((document.getElementById('rm-weight') as HTMLInputElement)?.value)
    const reps = parseFloat((document.getElementById('rm-reps') as HTMLInputElement)?.value)

    if (!weight || !reps) return

    const resultDiv = document.getElementById('rm-result')
    if (resultDiv) {
      if (reps === 1) {
        resultDiv.textContent = `Tu 1RM es: ${weight.toFixed(1)} kg`
      } else {
        const oneRepMax = weight * (1 + reps / 30)
        resultDiv.textContent = `Tu 1RM estimado es: ${oneRepMax.toFixed(1)} kg`
      }
    }
  }

  return (
    <div>
      <h2 className="rec-title">Biblioteca de Consejos y Herramientas</h2>

      <div id="tip-of-the-day-container" className="glass">
        <h3>🌟 Tip del Día 🌟</h3>
        <p>
          <strong>{todayTip.title}:</strong> {todayTip.content}
        </p>
      </div>

      {Object.entries(TIPS_CATEGORIES).map(([category, items]) => (
        <details key={category} className="tip-category">
          <summary>{category}</summary>
          {items.map((item, idx) => (
            <div key={idx} className="rec-item">
              <strong>{item.title}</strong>
              <p>{item.content}</p>
            </div>
          ))}
        </details>
      ))}

      {/* Calculadora de Calorías */}
      <details className="tip-category">
        <summary>🧮 Calculadoras</summary>
        <div className="tip-tool">
          <strong>Calculadora de Calorías</strong>
          <div className="tool-input-group">
            <select id="gender" className="tool-select">
              <option value="male">Hombre</option>
              <option value="female">Mujer</option>
            </select>
            <input type="number" id="age" placeholder="Edad" className="tool-input" />
            <input type="number" id="weight-cal" placeholder="Peso (kg)" className="tool-input" />
            <input type="number" id="height" placeholder="Altura (cm)" className="tool-input" />
            <select id="activity" className="tool-select" style={{ gridColumn: '1 / -1' }}>
              <option value="1.2">Sedentario (poco o nada de ejercicio)</option>
              <option value="1.375">Ligero (1-3 días/semana)</option>
              <option value="1.55" defaultChecked>
                Moderado (3-5 días/semana)
              </option>
              <option value="1.725">Activo (6-7 días/semana)</option>
              <option value="1.9">Muy activo (trabajo físico + entreno)</option>
            </select>
          </div>
          <button className="tool-btn btn-shine" onClick={calculateCalories}>
            Calcular
          </button>
          <div id="calorie-result" className="tool-result"></div>
        </div>

        <div className="tip-tool">
          <strong>Calculadora de 1RM (1 Rep Máx.)</strong>
          <div className="tool-input-group">
            <input type="number" id="rm-weight" placeholder="Peso (kg)" className="tool-input" />
            <input type="number" id="rm-reps" placeholder="Repeticiones" className="tool-input" />
          </div>
          <button className="tool-btn btn-shine" onClick={calculateTool1RM}>
            Calcular
          </button>
          <div id="rm-result" className="tool-result"></div>
        </div>
      </details>
    </div>
  )
}
