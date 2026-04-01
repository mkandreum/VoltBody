import React, { useMemo, useState } from 'react'
import { DAILY_TIPS, MOTIVATIONAL_PHRASES } from '@/constants'
import { CommunityMessage, UserProfile, WorkoutCatalogSelection } from '@/types'

interface TipsSectionProps {
  profile: UserProfile
  motivationPhrase: string
  motivationPhoto: string
  communityMessages: CommunityMessage[]
  selectedExercises: WorkoutCatalogSelection
  onSetMotivation: (phrase: string, photo: string) => void
  onAddCommunityMessage: (author: string, text: string) => void
  onClearCommunityMessages: () => void
}

const generateAiPlan = (
  profile: UserProfile,
  selectedExercises: WorkoutCatalogSelection
): string[] => {
  const groups = profile.priorities.length > 0 ? profile.priorities : ['pierna', 'espalda']
  const lines: string[] = []

  lines.push(`Objetivo: ${profile.fitnessGoal.replace('_', ' ')}`)
  lines.push(`Lugar: ${profile.trainingPlace} | Hora sugerida: ${profile.trainTime}`)
  lines.push(`Pasos diarios objetivo: ${Math.max(profile.dailySteps, 6000)}`)

  groups.forEach(group => {
    const list = selectedExercises[group as keyof WorkoutCatalogSelection] || []
    const picks = list.slice(0, 3)
    if (picks.length > 0) {
      lines.push(`${group.toUpperCase()}: ${picks.join(', ')}`)
    }
  })

  if (profile.injuryPathologies) {
    lines.push(`Ajuste por lesion: evitar dolor en ${profile.injuryPathologies}.`) 
  }

  if (profile.foodPathologies) {
    lines.push(`Ajuste nutricional por patologias: ${profile.foodPathologies}.`)
  }

  lines.push('Sesion sugerida: 5 min movilidad, bloque principal 40 min, core 10 min, vuelta a calma 5 min.')
  return lines
}

export const TipsSection: React.FC<TipsSectionProps> = ({
  profile,
  motivationPhrase,
  motivationPhoto,
  communityMessages,
  selectedExercises,
  onSetMotivation,
  onAddCommunityMessage,
  onClearCommunityMessages,
}) => {
  const [author, setAuthor] = useState('')
  const [message, setMessage] = useState('')
  const [localPhrase, setLocalPhrase] = useState(motivationPhrase)
  const [localPhoto, setLocalPhoto] = useState(motivationPhoto)

  const startDate = new Date('2024-01-01')
  const today = new Date()
  const dayOfYear = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
  const todayTip = DAILY_TIPS[dayOfYear % DAILY_TIPS.length]

  const aiPlan = useMemo(
    () => generateAiPlan(profile, selectedExercises),
    [profile, selectedExercises]
  )

  const randomPhrase = () => {
    const phrase = MOTIVATIONAL_PHRASES[Math.floor(Math.random() * MOTIVATIONAL_PHRASES.length)]
    setLocalPhrase(phrase)
  }

  const saveMotivation = () => {
    onSetMotivation(localPhrase, localPhoto)
  }

  const onPhotoFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : ''
      setLocalPhoto(result)
    }
    reader.readAsDataURL(file)
  }

  const publishMessage = () => {
    onAddCommunityMessage(author, message)
    setMessage('')
  }

  return (
    <div>
      <h2 className="rec-title">Motivacion, IA y Comunidad</h2>

      <div id="tip-of-the-day-container" className="glass">
        <h3>Tip del dia</h3>
        <p>
          <strong>{todayTip.title}:</strong> {todayTip.content}
        </p>
      </div>

      <div className="glass card">
        <h3>Motivacion con frase y foto</h3>
        <textarea
          className="tool-input"
          value={localPhrase}
          onChange={e => setLocalPhrase(e.target.value)}
          placeholder="Escribe tu frase"
        />
        <div className="confirmation-buttons section-space-sm">
          <button className="tool-btn btn-shine" type="button" onClick={randomPhrase}>
            Frase aleatoria
          </button>
          <button className="tool-btn btn-shine" type="button" onClick={saveMotivation}>
            Guardar motivacion
          </button>
        </div>
        <input
          type="file"
          className="tool-input"
          accept="image/*"
          onChange={onPhotoFile}
          
        />
        {localPhoto && (
          <div className="photo-gallery media-preview section-space-sm">
            <img src={localPhoto} alt="Motivacion" />
          </div>
        )}
      </div>

      <div className="glass card">
        <h3>Generador IA realista (reglas de perfil)</h3>
        <div className="plan-lines">
        {aiPlan.map((line, index) => (
          <p key={index} className="plan-line">
            {line}
          </p>
        ))}
        </div>
      </div>

      <div className="glass card">
        <h3>Comunicacion entre usuarios</h3>
        <div className="metrics-form">
          <input
            type="text"
            className="tool-input"
            placeholder="Tu nombre"
            value={author}
            onChange={e => setAuthor(e.target.value)}
          />
          <input
            type="text"
            className="tool-input"
            placeholder="Escribe un mensaje"
            value={message}
            onChange={e => setMessage(e.target.value)}
          />
        </div>
        <div className="confirmation-buttons">
          <button type="button" className="tool-btn btn-shine" onClick={publishMessage}>
            Publicar
          </button>
          <button type="button" className="tool-btn delete-btn btn-shine" onClick={onClearCommunityMessages}>
            Limpiar muro
          </button>
        </div>

        <div className="history-table-container section-space-sm">
          {communityMessages.length === 0 && (
            <p className="section-caption">Aun no hay mensajes en el muro.</p>
          )}
          <div className="message-feed">
          {communityMessages.map(item => (
            <div key={item.id} className="rec-item message-card">
              <strong>{item.author}</strong>
              <p>{item.text}</p>
              <small className="message-meta">
                {new Date(item.createdAt).toLocaleString()}
              </small>
            </div>
          ))}
          </div>
        </div>
      </div>
    </div>
  )
}
