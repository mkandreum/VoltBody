import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { WORKOUT_DATA } from '@/constants/workoutData';
import { DAY_NAMES } from '@/constants';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);
export const HistorySection = ({ historySelectedDay, onDayChange, historicalData, }) => {
    return (_jsxs("div", { children: [_jsx("div", { style: { marginBottom: '20px' }, children: _jsx("div", { className: "day-selector-wrapper", children: _jsx("div", { className: "day-selector", children: Object.keys(WORKOUT_DATA).map(day => (_jsx("button", { className: `day-btn ${day === historySelectedDay ? 'active' : ''}`, onClick: () => onDayChange(day), children: DAY_NAMES[day] }, day))) }) }) }), _jsx("div", { id: "history-charts-container", children: !historicalData[historySelectedDay] && (_jsxs("div", { id: "no-history-message", className: "glass card", children: ["\uD83E\uDD37\u200D\u2642\uFE0F No hay datos de progreso para ", DAY_NAMES[historySelectedDay], ".", _jsx("br", {}), "\u00A1Completa un entreno y pulsa \uD83D\uDCBE Guardar!"] })) })] }));
};
