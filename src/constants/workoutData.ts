import { WorkoutDay } from '@/types'

export const WORKOUT_DATA: Record<string, WorkoutDay> = {
  lunes: {
    type: '🔥 Pecho y Tríceps (Empuje)',
    duration: '~75 min',
    exercises: [
      { name: 'Press Banca', sets: 4, reps: '6-8' },
      { name: 'Press Inclinado con Mancuernas', sets: 3, reps: '8-12' },
      { name: 'Aperturas en Polea Alta', sets: 3, reps: '12-15' },
      { name: 'Press Francés', sets: 3, reps: '8-12' },
      { name: 'Extensiones de Tríceps en Polea', sets: 3, reps: '12-15' },
      { name: 'Flexiones', sets: 2, reps: 'Al fallo' },
    ],
    core: 'Plancha (3x60s)',
  },
  martes: {
    type: '✈️ Espalda y Bíceps (Tirón)',
    duration: '~75 min',
    exercises: [
      { name: 'Dominadas / Jalón al Pecho', sets: 4, reps: '6-10' },
      { name: 'Remo con Barra', sets: 4, reps: '6-8' },
      { name: 'Remo Gironda (Polea Baja)', sets: 3, reps: '10-12' },
      { name: 'Face Pull', sets: 3, reps: '15-20' },
      { name: 'Curl con Barra Z', sets: 3, reps: '8-12' },
      { name: 'Curl Martillo', sets: 3, reps: '10-15' },
    ],
    core: 'Elev. de Piernas (3x15)',
  },
  miercoles: {
    type: '🍗 Pierna (Énfasis Cuádriceps)',
    duration: '~80 min',
    exercises: [
      { name: 'Sentadilla Libre', sets: 4, reps: '6-8' },
      { name: 'Prensa Inclinada', sets: 3, reps: '10-12' },
      { name: 'Zancadas con Mancuernas', sets: 3, reps: '10-12 p/p' },
      { name: 'Extensiones de Cuádriceps', sets: 4, reps: '12-15' },
      { name: 'Elevación de Talones de pie', sets: 4, reps: '15-20' },
    ],
    core: '',
  },
  jueves: {
    type: '❤️ Cardio y Movilidad',
    duration: '~45 min',
    exercises: [
      { name: 'Caminata en cinta (inclinada)', sets: 1, reps: '30-40 min' },
      { name: 'Estiramientos dinámicos y Foam Roller', sets: 1, reps: '10-15 min' },
    ],
    core: '',
  },
  viernes: {
    type: '💪 Hombros y Trapecio',
    duration: '~60 min',
    exercises: [
      { name: 'Press Militar con Barra', sets: 4, reps: '6-8' },
      { name: 'Elevaciones Laterales con Mancuernas', sets: 4, reps: '12-15' },
      { name: 'Pájaros (Elevaciones Posteriores)', sets: 3, reps: '12-15' },
      { name: 'Remo al Mentón', sets: 3, reps: '10-12' },
      { name: 'Encogimientos con Mancuernas', sets: 4, reps: '10-15' },
    ],
    core: '',
  },
  sabado: {
    type: '🦵 Pierna (Énfasis Femoral) y Core',
    duration: '~70 min',
    exercises: [
      { name: 'Peso Muerto Rumano', sets: 4, reps: '8-10' },
      { name: 'Curl Femoral Tumbado', sets: 3, reps: '12-15' },
      { name: 'Hip Thrust', sets: 4, reps: '8-12' },
      { name: 'Prensa Horizontal (pies altos)', sets: 3, reps: '12-15' },
      { name: 'Elevación de Piernas Colgado', sets: 3, reps: 'Al fallo' },
      { name: 'Plancha con peso', sets: 3, reps: '60s' },
    ],
    core: '',
  },
  domingo: {
    type: '🧘‍♂️ Descanso Total',
    duration: 'Todo el día',
    exercises: [{ name: 'Recuperación activa ligera (opcional)', sets: 1, reps: 'Paseo, estiramientos suaves' }],
    core: '',
  },
}
