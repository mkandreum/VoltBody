import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { TIPS_CATEGORIES, DAILY_TIPS } from '@/constants';
export const TipsSection = ({ onShowModal }) => {
    const getTodayTip = () => {
        const startDate = new Date('2024-01-01');
        const today = new Date();
        const dayOfYear = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        const tipIndex = dayOfYear % DAILY_TIPS.length;
        return DAILY_TIPS[tipIndex];
    };
    const todayTip = getTodayTip();
    const calculateCalories = () => {
        const gender = document.getElementById('gender')?.value;
        const age = parseFloat(document.getElementById('age')?.value);
        const weight = parseFloat(document.getElementById('weight-cal')?.value);
        const height = parseFloat(document.getElementById('height')?.value);
        const activity = parseFloat(document.getElementById('activity')?.value);
        if (!age || !weight || !height)
            return;
        let bmr;
        if (gender === 'male') {
            bmr = 10 * weight + 6.25 * height - 5 * age + 5;
        }
        else {
            bmr = 10 * weight + 6.25 * height - 5 * age - 161;
        }
        const maintenance = Math.round(bmr * activity);
        const deficit = maintenance - 400;
        const surplus = maintenance + 400;
        const resultDiv = document.getElementById('calorie-result');
        if (resultDiv) {
            resultDiv.innerHTML = `
        <p>Mantenimiento: ~${maintenance} kcal/día</p>
        <p style="color: var(--neon-red);">Déficit (perder): ~${deficit} kcal/día</p>
        <p style="color: var(--neon-green);">Superávit (ganar): ~${surplus} kcal/día</p>
      `;
        }
    };
    const calculateTool1RM = () => {
        const weight = parseFloat(document.getElementById('rm-weight')?.value);
        const reps = parseFloat(document.getElementById('rm-reps')?.value);
        if (!weight || !reps)
            return;
        const resultDiv = document.getElementById('rm-result');
        if (resultDiv) {
            if (reps === 1) {
                resultDiv.textContent = `Tu 1RM es: ${weight.toFixed(1)} kg`;
            }
            else {
                const oneRepMax = weight * (1 + reps / 30);
                resultDiv.textContent = `Tu 1RM estimado es: ${oneRepMax.toFixed(1)} kg`;
            }
        }
    };
    return (_jsxs("div", { children: [_jsx("h2", { className: "rec-title", children: "Biblioteca de Consejos y Herramientas" }), _jsxs("div", { id: "tip-of-the-day-container", className: "glass", children: [_jsx("h3", { children: "\uD83C\uDF1F Tip del D\u00EDa \uD83C\uDF1F" }), _jsxs("p", { children: [_jsxs("strong", { children: [todayTip.title, ":"] }), " ", todayTip.content] })] }), Object.entries(TIPS_CATEGORIES).map(([category, items]) => (_jsxs("details", { className: "tip-category", children: [_jsx("summary", { children: category }), items.map((item, idx) => (_jsxs("div", { className: "rec-item", children: [_jsx("strong", { children: item.title }), _jsx("p", { children: item.content })] }, idx)))] }, category))), _jsxs("details", { className: "tip-category", children: [_jsx("summary", { children: "\uD83E\uDDEE Calculadoras" }), _jsxs("div", { className: "tip-tool", children: [_jsx("strong", { children: "Calculadora de Calor\u00EDas" }), _jsxs("div", { className: "tool-input-group", children: [_jsxs("select", { id: "gender", className: "tool-select", children: [_jsx("option", { value: "male", children: "Hombre" }), _jsx("option", { value: "female", children: "Mujer" })] }), _jsx("input", { type: "number", id: "age", placeholder: "Edad", className: "tool-input" }), _jsx("input", { type: "number", id: "weight-cal", placeholder: "Peso (kg)", className: "tool-input" }), _jsx("input", { type: "number", id: "height", placeholder: "Altura (cm)", className: "tool-input" }), _jsxs("select", { id: "activity", className: "tool-select", style: { gridColumn: '1 / -1' }, children: [_jsx("option", { value: "1.2", children: "Sedentario (poco o nada de ejercicio)" }), _jsx("option", { value: "1.375", children: "Ligero (1-3 d\u00EDas/semana)" }), _jsx("option", { value: "1.55", defaultChecked: true, children: "Moderado (3-5 d\u00EDas/semana)" }), _jsx("option", { value: "1.725", children: "Activo (6-7 d\u00EDas/semana)" }), _jsx("option", { value: "1.9", children: "Muy activo (trabajo f\u00EDsico + entreno)" })] })] }), _jsx("button", { className: "tool-btn btn-shine", onClick: calculateCalories, children: "Calcular" }), _jsx("div", { id: "calorie-result", className: "tool-result" })] }), _jsxs("div", { className: "tip-tool", children: [_jsx("strong", { children: "Calculadora de 1RM (1 Rep M\u00E1x.)" }), _jsxs("div", { className: "tool-input-group", children: [_jsx("input", { type: "number", id: "rm-weight", placeholder: "Peso (kg)", className: "tool-input" }), _jsx("input", { type: "number", id: "rm-reps", placeholder: "Repeticiones", className: "tool-input" })] }), _jsx("button", { className: "tool-btn btn-shine", onClick: calculateTool1RM, children: "Calcular" }), _jsx("div", { id: "rm-result", className: "tool-result" })] })] })] }));
};
