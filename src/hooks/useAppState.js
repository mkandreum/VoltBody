// Hook personalizado para gestión de estado global
import { useState, useEffect, useCallback } from 'react';
const getTodaySpanish = () => {
    const days = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
    return days[new Date().getDay()];
};
const STORAGE_KEY = 'fitnessLiquidData';
const THEME_KEY = 'fitnessTheme';
const LAST_TAB_KEY = 'fitnessLiquidLastTab';
const LAST_DAY_KEY = 'fitnessLiquidLastDay';
export const useAppState = () => {
    const [state, setState] = useState({
        currentDay: getTodaySpanish(),
        currentTab: 'diet',
        historySelectedDay: getTodaySpanish(),
        theme: 'theme-blue',
        workoutInputs: {},
        historicalData: { bodyMetrics: [] },
    });
    const [isLoaded, setIsLoaded] = useState(false);
    // Cargar datos al inicializar
    useEffect(() => {
        try {
            const savedData = localStorage.getItem(STORAGE_KEY);
            const savedTheme = localStorage.getItem(THEME_KEY) || 'theme-blue';
            const savedTab = localStorage.getItem(LAST_TAB_KEY) || 'diet';
            const savedDay = localStorage.getItem(LAST_DAY_KEY) || getTodaySpanish();
            const parsedData = savedData ? JSON.parse(savedData) : {};
            setState(prev => ({
                ...prev,
                theme: savedTheme,
                currentTab: savedTab,
                currentDay: savedDay,
                historySelectedDay: getTodaySpanish(),
                historicalData: parsedData.historicalData || { bodyMetrics: [] },
            }));
            // Aplicar tema
            document.body.className = savedTheme;
        }
        catch (error) {
            console.error('Error loading saved data:', error);
        }
        finally {
            setIsLoaded(true);
        }
    }, []);
    // Guardar tema
    const setTheme = useCallback((theme) => {
        setState(prev => ({ ...prev, theme }));
        localStorage.setItem(THEME_KEY, theme);
        document.body.className = theme;
    }, []);
    // Cambiar tab
    const switchTab = useCallback((tab) => {
        setState(prev => ({ ...prev, currentTab: tab }));
        localStorage.setItem(LAST_TAB_KEY, tab);
        window.scrollTo(0, 0);
    }, []);
    // Cambiar día
    const switchDay = useCallback((day) => {
        setState(prev => ({ ...prev, currentDay: day }));
        localStorage.setItem(LAST_DAY_KEY, day);
    }, []);
    // Cambiar día en historial
    const setHistorySelectedDay = useCallback((day) => {
        setState(prev => ({ ...prev, historySelectedDay: day }));
    }, []);
    // Actualizar input de entreno
    const updateWorkoutInput = useCallback((key, field, value) => {
        setState(prev => ({
            ...prev,
            workoutInputs: {
                ...prev.workoutInputs,
                [key]: { ...prev.workoutInputs[key], [field]: value },
            },
        }));
    }, []);
    // Guardar datos históricos
    const saveHistoricalData = useCallback((data) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ historicalData: data }));
            setState(prev => ({ ...prev, historicalData: data }));
        }
        catch (error) {
            console.error('Error saving data:', error);
        }
    }, []);
    // Añadir medida corporal
    const addBodyMetric = useCallback((metric) => {
        setState(prev => {
            const newData = { ...prev.historicalData };
            const metrics = Array.isArray(newData.bodyMetrics) ? newData.bodyMetrics : [];
            metrics.push(metric);
            metrics.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            newData.bodyMetrics = metrics;
            saveHistoricalData(newData);
            return { ...prev, historicalData: newData };
        });
    }, [saveHistoricalData]);
    // Completar comida
    const toggleMealCheck = useCallback((mealId, checked) => {
        if (checked) {
            localStorage.setItem(mealId, 'true');
        }
        else {
            localStorage.removeItem(mealId);
        }
    }, []);
    // Verificar si comida está completada
    const isMealChecked = useCallback((mealId) => {
        return localStorage.getItem(mealId) === 'true';
    }, []);
    // Limpiar todos los datos
    const deleteAllData = useCallback(() => {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(THEME_KEY);
        localStorage.removeItem(LAST_TAB_KEY);
        localStorage.removeItem(LAST_DAY_KEY);
        Object.keys(localStorage).forEach(key => {
            if (key.includes('-meal-')) {
                localStorage.removeItem(key);
            }
        });
        setState({
            currentDay: getTodaySpanish(),
            currentTab: 'diet',
            historySelectedDay: getTodaySpanish(),
            theme: 'theme-blue',
            workoutInputs: {},
            historicalData: { bodyMetrics: [] },
        });
        document.body.className = 'theme-blue';
    }, []);
    return {
        ...state,
        isLoaded,
        setTheme,
        switchTab,
        switchDay,
        setHistorySelectedDay,
        updateWorkoutInput,
        saveHistoricalData,
        addBodyMetric,
        toggleMealCheck,
        isMealChecked,
        deleteAllData,
    };
};
export const useToast = () => {
    const [toast, setToast] = useState('');
    const showToast = useCallback((message) => {
        setToast(message);
        setTimeout(() => setToast(''), 2500);
    }, []);
    return { toast, showToast };
};
export const useModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [content, setContent] = useState('');
    const showModal = useCallback((html) => {
        setContent(html);
        setIsOpen(true);
    }, []);
    const closeModal = useCallback(() => {
        setIsOpen(false);
        setTimeout(() => setContent(''), 300);
    }, []);
    return { isOpen, content, showModal, closeModal };
};
