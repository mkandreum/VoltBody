import React, { useState } from 'react'

interface AuthScreenProps {
  loading: boolean
  onLogin: (email: string, password: string) => Promise<void>
  onRegister: (name: string, email: string, password: string) => Promise<void>
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ loading, onLogin, onRegister }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (mode === 'login') {
      await onLogin(email, password)
      return
    }
    await onRegister(name, email, password)
  }

  return (
    <div className="auth-shell">
      <div className="liquid-container">
        <div className="blob blob1"></div>
        <div className="blob blob2"></div>
        <div className="blob blob3"></div>
        <div className="blob blob4"></div>
      </div>

      <div className="auth-card glass">
        <p className="auth-kicker">VoltBody</p>
        <div className="auth-mode-switch" role="tablist" aria-label="Modo de acceso">
          <button
            type="button"
            className={`auth-mode-pill ${mode === 'login' ? 'active' : ''}`}
            onClick={() => setMode('login')}
          >
            Entrar
          </button>
          <button
            type="button"
            className={`auth-mode-pill ${mode === 'register' ? 'active' : ''}`}
            onClick={() => setMode('register')}
          >
            Crear cuenta
          </button>
        </div>
        <h1>{mode === 'login' ? 'Entrar' : 'Crear cuenta'}</h1>
        <p className="auth-copy">
          Guarda tu plan, sincroniza entre dispositivos y usa un perfil real dentro de la app.
        </p>
        <div className="auth-feature-strip">
          <span>Rutina diaria</span>
          <span>Cloud sync</span>
          <span>Progreso real</span>
        </div>

        <form className="auth-form" onSubmit={submit}>
          {mode === 'register' && (
            <input
              type="text"
              className="tool-input"
              placeholder="Nombre"
              value={name}
              onChange={event => setName(event.target.value)}
              required
            />
          )}

          <input
            type="email"
            className="tool-input"
            placeholder="Email"
            value={email}
            onChange={event => setEmail(event.target.value)}
            required
          />

          <input
            type="password"
            className="tool-input"
            placeholder="Password"
            value={password}
            onChange={event => setPassword(event.target.value)}
            required
            minLength={6}
          />

          <button type="submit" className="tool-btn btn-shine auth-submit" disabled={loading}>
            {loading ? 'Procesando...' : mode === 'login' ? 'Entrar' : 'Crear cuenta'}
          </button>
        </form>

        <p className="auth-helper-copy">
          Acceso pensado para usarlo con una sola mano: campos claros, CTA principal y cambio de modo visible arriba.
        </p>

        <button
          type="button"
          className="auth-toggle"
          onClick={() => setMode(prev => (prev === 'login' ? 'register' : 'login'))}
        >
          {mode === 'login' ? 'No tengo cuenta' : 'Ya tengo cuenta'}
        </button>
      </div>
    </div>
  )
}