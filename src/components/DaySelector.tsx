import React from 'react'
import { DAY_ORDER, DAY_NAMES } from '@/constants'

interface DaySelectorProps {
  currentDay: string
  enabledDays?: string[]
  onDayChange: (day: string) => void
}

export const DaySelector: React.FC<DaySelectorProps> = ({ currentDay, enabledDays, onDayChange }) => {
  return (
    <div className="day-selector-wrapper">
      <div className="day-selector">
        {DAY_ORDER.map(day => {
          const isEnabled = !enabledDays || enabledDays.includes(day)
          return (
            <button
              key={day}
              className={`day-btn ${day === currentDay ? 'active' : ''}`}
              onClick={() => onDayChange(day)}
              disabled={!isEnabled}
              style={{ opacity: isEnabled ? 1 : 0.4 }}
            >
              {DAY_NAMES[day]}
            </button>
          )
        })}
      </div>
    </div>
  )
}
