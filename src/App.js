import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { DaySelector, DietSection, WorkoutSection, HistorySection, GoalsSection, TipsSection, Header, Navigation, Toast, Modal, } from '@/components';
import { useAppState, useToast, useModal } from '@/hooks';
import { EXERCISE_GUIDES } from '@/constants';
function App() {
    const [mounted, setMounted] = useState(false);
    const state = useAppState();
    const { toast, showToast } = useToast();
    const { isOpen, content, showModal, closeModal } = useModal();
    useEffect(() => {
        setMounted(true);
    }, []);
    useEffect(() => {
        document.body.className = state.theme;
    }, [state.theme]);
    if (!mounted)
        return null;
    const handleSaveProgress = () => {
        state.saveHistoricalData(state.historicalData);
        showToast('Progreso guardado correctamente ✅');
    };
    const handleShowExerciseGuide = (exerciseName) => {
        const gifUrl = EXERCISE_GUIDES[exerciseName] || '';
        showModal(`<h3>${exerciseName} - Guía Técnica</h3>
       <img src="${gifUrl}" style="width: 100%; max-height: 400px; object-fit: contain;" alt="${exerciseName}" />`);
    };
    const handleShowSettings = () => {
        showModal(`<div style="color: white;">
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
      </div>`);
    };
    const handleLightning = () => {
        const overlay = document.getElementById('lightning-overlay');
        if (overlay) {
            overlay.style.opacity = '1';
            overlay.style.pointerEvents = 'auto';
            setTimeout(() => {
                overlay.style.opacity = '0';
                overlay.style.pointerEvents = 'none';
            }, 300);
        }
        showToast('¡Poder Activado! ⚡');
    };
    const renderSection = () => {
        switch (state.currentTab) {
            case 'diet':
                return (_jsx(DietSection, { currentDay: state.currentDay, onMealCheck: (mealId, checked) => state.toggleMealCheck(mealId, checked), isMealChecked: (mealId) => state.isMealChecked(mealId) }));
            case 'workout':
                return (_jsx(WorkoutSection, { currentDay: state.currentDay, workoutInputs: state.workoutInputs, onInputChange: (key, field, value) => state.updateWorkoutInput(key, field, value), onSaveProgress: handleSaveProgress, onShowExerciseGuide: handleShowExerciseGuide }));
            case 'history':
                return (_jsx(HistorySection, { historySelectedDay: state.historySelectedDay, onDayChange: (day) => state.setHistorySelectedDay(day), historicalData: state.historicalData }));
            case 'goals':
                return _jsx(GoalsSection, {});
            case 'tips':
                return _jsx(TipsSection, { onShowModal: showModal });
            default:
                return null;
        }
    };
    return (_jsxs("div", { children: [_jsxs("div", { className: "liquid-container", children: [_jsx("div", { className: "blob blob1" }), _jsx("div", { className: "blob blob2" }), _jsx("div", { className: "blob blob3" }), _jsx("div", { className: "blob blob4" })] }), _jsx("div", { id: "lightning-overlay" }), _jsxs("div", { className: "container", children: [_jsx(Header, { onSettingsClick: handleShowSettings, onLightningClick: handleLightning, dailyProgress: 0 }), _jsx("div", { className: "main-day-selector-wrapper", children: _jsx("div", { className: "day-selector-wrapper", children: _jsx(DaySelector, { currentDay: state.currentDay, onDayChange: (day) => state.switchDay(day) }) }) }), _jsx("main", { children: _jsx("section", { className: "content-section", children: renderSection() }) })] }), _jsx(Navigation, { currentTab: state.currentTab, onTabChange: (tab) => state.switchTab(tab) }), _jsx(Toast, { message: toast }), _jsx(Modal, { isOpen: isOpen, content: content, onClose: closeModal }), _jsx("input", { type: "file", id: "restore-input", accept: ".json", style: { display: 'none' } }), _jsx("input", { type: "file", id: "photo-input", accept: "image/*", style: { display: 'none' } })] }));
}
export default App;
