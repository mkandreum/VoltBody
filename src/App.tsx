import { useState, useEffect } from 'react'
import {
  DaySelector,
  DietSection,
  WorkoutSection,
  HistorySection,
  GoalsSection,
  TipsSection,
  Header,
  Navigation,
  Toast,
  Modal,
} from '@/components'
import { useAppState, useToast, useModal } from '@/hooks'
import { EXERCISE_GUIDES } from '@/constants'

function App() {
  const [mounted, setMounted] = useState(false)
  const state = useAppState()
  const { toast, showToast } = useToast()
  const { isOpen, content, showModal, closeModal } = useModal()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    document.body.className = state.theme
  }, [state.theme])

  if (!mounted) return null

  const handleSaveProgress = () => {
    state.saveHistoricalData(state.historicalData)
    showToast('Progreso guardado correctamente ✅')
  }

  const handleShowExerciseGuide = (exerciseName: string) => {
    const gifUrl = EXERCISE_GUIDES[exerciseName] || ''
    showModal(
      `<h3>${exerciseName} - Guía Técnica</h3>
       <img src="${gifUrl}" style="width: 100%; max-height: 400px; object-fit: contain;" alt="${exerciseName}" />`
    )
  }

  const handleShowSettings = () => {
    showModal(
      `<div style="color: white;">
        <h3>Ajustes</h3>
        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 8px;">Tema Actual: ${state.theme}</label>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <button onclick="window.location.reload()">Guardar</button>
            <button onclick="document.querySelector('[data-close-modal]')?.click()">Cerrar</button>
          </div>
        </div>
        <button onclick="
          const input = document.getElementById('restore-input');
          if (input) input.click();
        " style="width: 100%; padding: 8px; margin-bottom: 8px;">Importar Datos</button>
        <button onclick="
          const data = JSON.stringify(JSON.parse(localStorage.getItem('appState') || '{}'), null, 2);
          const blob = new Blob([data], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'voltbody-backup.json';
          a.click();
          URL.revokeObjectURL(url);
        " style="width: 100%; padding: 8px;">Exportar Datos</button>
      </div>`
    )
  }

  const handleLightning = () => {
    const overlay = document.getElementById('lightning-overlay')
    if (overlay) {
      overlay.style.opacity = '1'
      overlay.style.pointerEvents = 'auto'
      setTimeout(() => {
        overlay.style.opacity = '0'
        overlay.style.pointerEvents = 'none'
      }, 300)
    }
    showToast('¡Poder Activado! ⚡')
  }

  const renderSection = () => {
    switch (state.currentTab) {
      case 'diet':
        return (
          <DietSection
            currentDay={state.currentDay}
            onMealCheck={(mealId: string, checked: boolean) => state.toggleMealCheck(mealId, checked)}
            isMealChecked={(mealId: string) => state.isMealChecked(mealId)}
          />
        )
      case 'workout':
        return (
          <WorkoutSection
            currentDay={state.currentDay}
            workoutInputs={state.workoutInputs}
            onInputChange={(key: string, field: 'weight' | 'rpe', value: string) =>
              state.updateWorkoutInput(key, field, value)
            }
            onSaveProgress={handleSaveProgress}
            onShowExerciseGuide={handleShowExerciseGuide}
          />
        )
      case 'history':
        return (
          <HistorySection
            historySelectedDay={state.historySelectedDay}
            onDayChange={(day: string) => state.setHistorySelectedDay(day)}
            historicalData={state.historicalData}
          />
        )
      case 'goals':
        return <GoalsSection />
      case 'tips':
        return <TipsSection onShowModal={showModal} />
      default:
        return null
    }
  }

  return (
    <div>
      {/* Fondos y efectos */}
      <div className="liquid-container">
        <div className="blob blob1"></div>
        <div className="blob blob2"></div>
        <div className="blob blob3"></div>
        <div className="blob blob4"></div>
      </div>
      <div id="lightning-overlay"></div>

      {/* Contenedor principal */}
      <div className="container">
        {/* Header */}
        <Header
          onSettingsClick={handleShowSettings}
          onLightningClick={handleLightning}
          dailyProgress={state.getDailyProgress(state.currentDay)}
        />

        {/* Selector de días */}
        <div className="main-day-selector-wrapper">
          <div className="day-selector-wrapper">
            <DaySelector
              currentDay={state.currentDay}
              onDayChange={(day: string) => state.switchDay(day)}
            />
          </div>
        </div>

        {/* Contenido principal */}
        <main>
          <section className="content-section">
            {renderSection()}
          </section>
        </main>
      </div>

      {/* Barra de navegación inferior */}
      <Navigation
        currentTab={state.currentTab}
        onTabChange={(tab: string) => state.switchTab(tab)}
      />

      {/* Toast y Modal */}
      <Toast message={toast} />
      <Modal isOpen={isOpen} content={content} onClose={closeModal} />

      {/* Inputs ocultos */}
      <input type="file" id="restore-input" accept=".json" style={{ display: 'none' }} />
      <input type="file" id="photo-input" accept="image/*" style={{ display: 'none' }} />
    </div>
  )
}

export default App
