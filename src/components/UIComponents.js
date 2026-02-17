import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const Toast = ({ message }) => {
    return (_jsx("div", { id: "toast", className: `toast ${message ? 'show' : ''}`, children: message }));
};
export const Modal = ({ isOpen, content, onClose }) => {
    return (_jsx("div", { id: "modal", className: `modal ${isOpen ? 'show' : ''}`, onClick: e => e.target === e.currentTarget && onClose(), children: _jsx("div", { id: "modal-content", className: "glass modal-content", dangerouslySetInnerHTML: { __html: content } }) }));
};
export const Header = ({ onSettingsClick, onLightningClick, dailyProgress }) => {
    return (_jsxs("header", { className: "glass header", children: [_jsxs("h1", { children: [_jsx("span", { className: "header-icon clickable-icon", onClick: onSettingsClick, title: "Abrir Ajustes", children: "\u2699\uFE0F" }), "VoltBody", _jsx("span", { id: "lightning-icon", className: "header-icon clickable-icon", onClick: onLightningClick, title: "\u00A1Activar Poder!", children: "\u26A1\uFE0F" })] }), _jsx("p", { children: "Plan Hipertrofia Personalizado" }), _jsx("div", { className: "progress-bar", children: _jsx("div", { id: "dailyProgress", className: "progress-fill", style: { width: `${dailyProgress}%` } }) })] }));
};
export const Navigation = ({ currentTab, onTabChange }) => {
    const tabs = [
        { id: 'diet', icon: '🍽️', label: 'Dieta' },
        { id: 'workout', icon: '🏋️', label: 'Entreno' },
        { id: 'history', icon: '📊', label: 'Progreso' },
        { id: 'goals', icon: '🎯', label: 'Objetivos' },
        { id: 'tips', icon: '💡', label: 'Tips' },
    ];
    return (_jsx("div", { className: "tab-bar-container", children: _jsxs("nav", { className: "nav-tabs glass", children: [_jsx("div", { className: "nav-indicator" }), tabs.map(tab => (_jsxs("div", { className: `nav-tab ${tab.id === currentTab ? 'active' : ''}`, onClick: () => onTabChange(tab.id), children: [_jsx("span", { className: "icon", children: tab.icon }), _jsx("span", { children: tab.label })] }, tab.id)))] }) }));
};
