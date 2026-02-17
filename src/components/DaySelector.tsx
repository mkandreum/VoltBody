import React from 'react'
import { DAY_ORDER, DAY_NAMES } from '@/constants'

interface DaySelectorProps {
  currentDay: string
  onDayChange: (day: string) => void
}

export const DaySelector: React.FC<DaySelectorProps> = ({ currentDay, onDayChange }) => {
  return (
    <div className="day-selector-wrapper">
      <div className="day-selector">
        {DAY_ORDER.map(day => (
          <button
            key={day}
            className={`day-btn ${day === currentDay ? 'active' : ''}`}
            onClick={() => onDayChange(day)}
          >
            {DAY_NAMES[day]}
          </button>
        ))}
      </div>
    </div>
  )
}
