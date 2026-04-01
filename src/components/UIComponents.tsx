import React from 'react'

interface ToastProps {
  message: string
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  return (
    <div id="toast" className={`toast ${message ? 'show' : ''}`}>
      {message}
    </div>
  )
}

interface ModalProps {
  isOpen: boolean
  content: React.ReactNode
  onClose: () => void
}

export const Modal: React.FC<ModalProps> = ({ isOpen, content, onClose }) => {
  return (
    <div id="modal" className={`modal ${isOpen ? 'show' : ''}`} onClick={e => e.target === e.currentTarget && onClose()}>
      <div id="modal-content" className="glass modal-content">{content}</div>
    </div>
  )
}

interface HeaderProps {
  onSettingsClick: () => void
  onLightningClick: () => void
  dailyProgress: number
}

export const Header: React.FC<HeaderProps> = ({ onSettingsClick, onLightningClick, dailyProgress }) => {
  return (
    <header className="glass header">
      <div className="header-meta-row">
        <span className="header-badge">Modo movil optimizado</span>
        <span className="header-badge header-badge-muted">{dailyProgress}% completado</span>
      </div>
      <h1>
        <span className="header-icon clickable-icon" onClick={onSettingsClick} title="Abrir Ajustes">
          ⚙️
        </span>
        VoltBody
        <span
          id="lightning-icon"
          className="header-icon clickable-icon"
          onClick={onLightningClick}
          title="¡Activar Poder!"
        >
          ⚡️
        </span>
      </h1>
      <p>Plan Hipertrofia Personalizado</p>
      <div className="progress-bar">
        <div id="dailyProgress" className="progress-fill" style={{ width: `${dailyProgress}%` }}></div>
      </div>
    </header>
  )
}

interface NavigationProps {
  currentTab: string
  onTabChange: (tab: string) => void
}

export const Navigation: React.FC<NavigationProps> = ({ currentTab, onTabChange }) => {
  const tabs = [
    { id: 'diet', icon: '🍽️', label: 'Dieta' },
    { id: 'workout', icon: '🏋️', label: 'Entreno' },
    { id: 'history', icon: '📊', label: 'Progreso' },
    { id: 'goals', icon: '🎯', label: 'Objetivos' },
    { id: 'tips', icon: '💡', label: 'Tips' },
  ]

  const activeIndex = tabs.findIndex(tab => tab.id === currentTab)
  const indicatorStyle = {
    width: `${100 / tabs.length}%`,
    transform: `translateX(${activeIndex * 100}%)`,
  }

  return (
    <div className="tab-bar-container">
      <nav className="nav-tabs glass">
        <div className="nav-indicator" style={indicatorStyle}></div>
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`nav-tab ${tab.id === currentTab ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
            type="button"
          >
            <span className="icon">{tab.icon}</span>
            <span className="nav-label">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
