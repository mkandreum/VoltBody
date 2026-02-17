import React, { useState, useEffect } from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js'
import 'chartjs-adapter-date-fns'
import { WORKOUT_DATA } from '@/constants/workoutData'
import { DAY_NAMES } from '@/constants'
import { HistoricalWorkout } from '@/types'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface HistorySectionProps {
  historySelectedDay: string
  onDayChange: (day: string) => void
  historicalData: Record<string, any>
}

export const HistorySection: React.FC<HistorySectionProps> = ({
  historySelectedDay,
  onDayChange,
  historicalData,
}) => {
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
        {!historicalData[historySelectedDay] && (
          <div id="no-history-message" className="glass card">
            🤷‍♂️ No hay datos de progreso para {DAY_NAMES[historySelectedDay]}.
            <br />
            ¡Completa un entreno y pulsa 💾 Guardar!
          </div>
        )}
      </div>
    </div>
  )
}
