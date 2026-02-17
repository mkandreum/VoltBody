import { jsx as _jsx } from "react/jsx-runtime";
import { DAY_ORDER, DAY_NAMES } from '@/constants';
export const DaySelector = ({ currentDay, onDayChange }) => {
    return (_jsx("div", { className: "day-selector-wrapper", children: _jsx("div", { className: "day-selector", children: DAY_ORDER.map(day => (_jsx("button", { className: `day-btn ${day === currentDay ? 'active' : ''}`, onClick: () => onDayChange(day), children: DAY_NAMES[day] }, day))) }) }));
};
