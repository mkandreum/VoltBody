import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { DIET_DATA } from '@/constants/dietData';
import { DAY_NAMES, MACRO_NAMES } from '@/constants';
export const DietSection = ({ currentDay, onMealCheck, isMealChecked }) => {
    const [alternatives, setAlternatives] = useState({});
    const dayMeals = DIET_DATA[currentDay] || [];
    const handleCycleAlternative = (mealIndex) => {
        const currentAlt = alternatives[mealIndex] ?? -1;
        const meal = dayMeals[mealIndex];
        const alternatives_count = meal.alternatives?.length || 0;
        let nextAlt = currentAlt + 1;
        if (nextAlt >= alternatives_count) {
            nextAlt = -1;
        }
        setAlternatives(prev => ({ ...prev, [mealIndex]: nextAlt }));
    };
    const renderMealContent = (meal, altIndex) => {
        const mealToShow = altIndex === -1 ? meal : meal.alternatives?.[altIndex];
        if (!mealToShow)
            return null;
        return (_jsxs(_Fragment, { children: [_jsx("p", { className: "meal-foods", children: mealToShow.foods }), _jsx("div", { className: "macros", children: Object.entries(mealToShow.macros).map(([key, value]) => (_jsxs("span", { className: "macro", children: [value, "g ", MACRO_NAMES[key]] }, key))) }), _jsx("p", { className: "preparation", children: mealToShow.prep })] }));
    };
    const totalCalories = dayMeals.reduce((sum, meal) => sum + meal.calories, 0);
    const totalProtein = dayMeals.reduce((sum, meal) => sum + meal.macros.p, 0);
    const totalCarbs = dayMeals.reduce((sum, meal) => sum + meal.macros.c, 0);
    const totalFats = dayMeals.reduce((sum, meal) => sum + meal.macros.f, 0);
    return (_jsxs("div", { children: [_jsxs("div", { className: "glass card summary-card", children: [_jsxs("h3", { className: "summary-title", children: ["Resumen del D\u00EDa: ", DAY_NAMES[currentDay]] }), _jsxs("div", { className: "summary-grid", children: [_jsxs("div", { className: "summary-item", children: [_jsx("h4", { children: "\u26A1 Calor\u00EDas" }), _jsxs("p", { children: ["~", totalCalories, " kcal"] })] }), _jsxs("div", { className: "summary-item", children: [_jsxs("h4", { children: ["\uD83C\uDF57 ", MACRO_NAMES.p] }), _jsxs("p", { children: ["~", totalProtein, " g"] })] }), _jsxs("div", { className: "summary-item", children: [_jsxs("h4", { children: ["\uD83C\uDF5A ", MACRO_NAMES.c] }), _jsxs("p", { children: ["~", totalCarbs, " g"] })] }), _jsxs("div", { className: "summary-item", children: [_jsxs("h4", { children: ["\uD83E\uDD51 ", MACRO_NAMES.f] }), _jsxs("p", { children: ["~", totalFats, " g"] })] })] })] }), dayMeals.map((meal, index) => {
                const mealId = `${currentDay}-meal-${index}`;
                const isChecked = isMealChecked(mealId);
                const isCompleted = isChecked ? 'completed' : '';
                const hasAlternatives = meal.alternatives && meal.alternatives.length > 0;
                const currentAlt = alternatives[index] ?? -1;
                return (_jsxs("div", { className: `glass card meal-card ${isCompleted}`, id: `meal-card-${index}`, children: [_jsxs("div", { className: "card-header", children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center' }, children: [_jsx("input", { type: "checkbox", className: "meal-check", id: `meal-check-${index}`, checked: isChecked, onChange: e => onMealCheck(mealId, e.target.checked) }), _jsx("label", { htmlFor: `meal-check-${index}`, className: "meal-time", children: meal.time })] }), _jsxs("div", { className: "meal-calories", children: [dayMeals[index].calories, " kcal"] })] }), _jsx("div", { className: "meal-content-wrapper", children: renderMealContent(meal, currentAlt) }), hasAlternatives && (_jsx("button", { className: "alt-meal-btn btn-shine", onClick: () => handleCycleAlternative(index), children: currentAlt === -1 ? 'Plato Alternativo' : `Alternativa ${currentAlt + 1}/${meal.alternatives?.length}` }))] }, index));
            })] }));
};
