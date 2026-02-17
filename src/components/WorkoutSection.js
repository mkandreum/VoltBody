import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { WORKOUT_DATA } from '@/constants/workoutData';
export const WorkoutSection = ({ currentDay, workoutInputs, onInputChange, onSaveProgress, onShowExerciseGuide, }) => {
    const workout = WORKOUT_DATA[currentDay];
    if (!workout)
        return null;
    const calculate1RM = (weight, reps) => {
        const w = parseFloat(weight);
        const r = parseInt(reps.split('-')[0]);
        if (w > 0 && r > 0) {
            return `1RM est: ${(w * (1 + r / 30)).toFixed(1)}kg`;
        }
        return '';
    };
    return (_jsxs("div", { className: "glass card", children: [_jsxs("div", { className: "card-header", children: [_jsx("div", { className: "workout-type", children: workout.type }), _jsx("div", { className: "workout-time", children: workout.duration })] }), _jsx("div", { className: "exercises", children: workout.exercises
                    .filter((ex) => ex.sets)
                    .map((exercise, index) => {
                    const inputKey = `${currentDay}_${exercise.name}`;
                    const input = workoutInputs[inputKey] || { weight: '', rpe: '' };
                    return (_jsxs("div", { className: "exercise-item", children: [_jsxs("div", { className: "exercise-details", children: [_jsxs("div", { className: "exercise-name", onClick: () => onShowExerciseGuide(exercise.name), children: ["\uD83D\uDCAA ", exercise.name] }), _jsxs("div", { className: "exercise-sets", children: [exercise.sets, "x", exercise.reps] }), _jsx("div", { className: "onerm-estimate", children: calculate1RM(input.weight, exercise.reps) })] }), _jsxs("div", { className: "weight-rpe-group", children: [_jsx("input", { type: "number", className: "weight-input", placeholder: "kg", value: input.weight, onChange: e => onInputChange(inputKey, 'weight', e.target.value) }), _jsxs("select", { className: "rpe-select", value: input.rpe, onChange: e => onInputChange(inputKey, 'rpe', e.target.value), children: [_jsx("option", { value: "", disabled: true, children: "RPE" }), [6, 7, 8, 9, 10].map(rpe => (_jsx("option", { value: rpe, children: rpe }, rpe)))] })] })] }, index));
                }) }), workout.core && (_jsxs("div", { className: "rec-item", style: { marginTop: '20px', borderLeftColor: 'var(--neon-pink)' }, children: [_jsx("strong", { children: "\uD83C\uDFAF Core:" }), " ", workout.core] })), _jsx("button", { className: "workout-save-btn btn-shine", onClick: onSaveProgress, children: "\uD83D\uDCBE Guardar" })] }));
};
