import React from 'react'

export const GoalsSection: React.FC = () => {
  return (
    <div>
      <h2 className="rec-title">🎯 Tus Objetivos a 3 Meses</h2>
      <div className="glass card">
        <h3>📈 Composición Corporal (Estimación)</h3>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '20px' }}>
          Basado en tus datos iniciales (78kg, ~23.2% grasa) y siguiendo el plan de forma consistente, estos son
          los cambios que puedes esperar.
        </p>
        <div className="summary-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="summary-item">
            <h4>⚖️ Peso Corporal</h4>
            <p>
              78kg ➡️ ~81kg <span style={{ color: 'var(--neon-green)' }}>(+3kg)</span>
            </p>
          </div>
          <div className="summary-item">
            <h4>💪 Músculo Esquelético</h4>
            <p>
              34.2kg ➡️ ~36.7kg <span style={{ color: 'var(--neon-green)' }}>(+2.5kg)</span>
            </p>
          </div>
          <div className="summary-item">
            <h4>🥑 Masa Grasa</h4>
            <p>
              18.1kg ➡️ ~18.6kg <span style={{ color: 'var(--neon-yellow)' }}>(+0.5kg)</span>
            </p>
          </div>
          <div className="summary-item">
            <h4>📊 % Grasa Corporal</h4>
            <p>
              23.2% ➡️ ~23.0% <span style={{ color: 'var(--neon-green)' }}>(-0.2%)</span>
            </p>
          </div>
        </div>
      </div>

      <div className="glass card">
        <h3>🎯 Objetivos Semanales</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '15px', textAlign: 'left' }}>
          El progreso real no se mide en grandes saltos, sino en pequeñas victorias consistentes. La clave es la{' '}
          <strong>sobrecarga progresiva</strong>.
        </p>
        <div className="summary-grid" style={{ gridTemplateColumns: '1fr', gap: '15px', marginBottom: '20px' }}>
          <div className="summary-item">
            <h4>📈 Ganancia Muscular Semanal</h4>
            <p>
              ~200 gr <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>(Teórico)</span>
            </p>
          </div>
        </div>
      </div>

      <div className="glass card">
        <h3>🏋️ Rendimiento de Fuerza (Estimado a 3 Meses)</h3>
        <div className="summary-grid" style={{ gridTemplateColumns: '1fr', gap: '15px' }}>
          <div className="summary-item">
            <h4>🔥 Press Banca</h4>
            <p>+10 a 15kg</p>
          </div>
          <div className="summary-item">
            <h4>🍗 Sentadilla Libre</h4>
            <p>+15 a 20kg</p>
          </div>
          <div className="summary-item">
            <h4>✈️ Remo con Barra</h4>
            <p>+10 a 15kg</p>
          </div>
          <div className="summary-item">
            <h4>💪 Press Militar</h4>
            <p>+5 a 10kg</p>
          </div>
        </div>
      </div>
    </div>
  )
}
