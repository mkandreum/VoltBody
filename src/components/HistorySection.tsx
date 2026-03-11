import React from 'react'
import { WORKOUT_DATA } from '@/constants/workoutData'
import { DAY_NAMES } from '@/constants'
import { HistoricalWorkout } from '@/types'

interface HistorySectionProps {
  historySelectedDay: string
  onDayChange: (day: string) => void
  historicalData: {
    bodyMetrics: any[]
    byDay: Record<string, HistoricalWorkout[]>
  }
}

export const HistorySection: React.FC<HistorySectionProps> = ({
  historySelectedDay,
  onDayChange,
  historicalData,
}) => {
  const dayHistory = Array.isArray(historicalData.byDay[historySelectedDay])
    ? (historicalData.byDay[historySelectedDay] as HistoricalWorkout[])
    : []

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <div className="day-selector-wrapper">
          <div className="day-selector">
            {Object.keys(WORKOUT_DATA).map(day => (
              <button
                key={day}
                className={`day-btn ${day === historySelectedDay ? 'active' : ''}`}
                onClick={() => onDayChange(day)}
              >
                {DAY_NAMES[day]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div id="history-charts-container">
        {dayHistory.length === 0 && (
          <div id="no-history-message" className="glass card">
            🤷‍♂️ No hay datos de progreso para {DAY_NAMES[historySelectedDay]}.
            <br />
            ¡Completa un entreno y pulsa 💾 Guardar!
          </div>
        )}

        {dayHistory.length > 0 && (
          <div className="glass card">
            <h3 className="history-exercise-title">Registros guardados</h3>
            <div className="history-table-container">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Peso (kg)</th>
                    <th>RPE</th>
                  </tr>
                </thead>
                <tbody>
                  {dayHistory
                    .slice()
                    .reverse()
                    .map((item, idx) => (
                      <tr key={`${item.date}-${idx}`}>
                        <td>{new Date(item.date).toLocaleString()}</td>
                        <td>{item.weight}</td>
                        <td>{item.rpe ?? '-'}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
