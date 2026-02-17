// Constantes - Datos de plan de hipertrofia
export const DAY_ORDER = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
export const DAY_NAMES = {
    lunes: 'Lunes',
    martes: 'Martes',
    miercoles: 'Miércoles',
    jueves: 'Jueves',
    viernes: 'Viernes',
    sabado: 'Sábado',
    domingo: 'Domingo',
};
export const MACRO_NAMES = {
    p: 'Proteínas',
    c: 'Carbohidratos',
    f: 'Grasas',
};
export const THEMES = {
    'theme-blue': 'Cyber Blue 💧',
    'theme-green': 'Toxic Green 🍀',
    'theme-pink': 'Hot Pink 🔥',
    'theme-yellow': 'Electric Yellow ⚡️',
    'theme-red': 'Cyber Red 🌶️',
    'theme-purple': 'Galactic Purple 🔮',
};
export const DAILY_TIPS = [
    {
        title: 'Hidratación es Clave',
        content: 'Bebe al menos 3-4 litros de agua al día. Una buena hidratación mejora el rendimiento, la recuperación y la función cerebral.',
    },
    {
        title: 'Prioriza el Descanso',
        content: 'El músculo crece cuando descansas, no cuando entrenas. Asegúrate de dormir entre 7 y 9 horas para una recuperación óptima.',
    },
    {
        title: 'La Consistencia Gana a la Intensidad',
        content: 'Es mejor entrenar 5 días a la semana de forma consistente durante meses, que 7 días a la semana durante un mes y luego abandonar.',
    },
    {
        title: 'No le Temas a los Carbohidratos',
        content: 'Son tu principal fuente de energía. Consúmelos estratégicamente alrededor de tus entrenamientos para maximizar el rendimiento.',
    },
    {
        title: 'Escucha a tu Cuerpo',
        content: 'Aprende a diferenciar entre el dolor muscular bueno (agujetas) y el dolor por lesión. Si algo duele de verdad, para y evalúa.',
    },
    {
        title: 'La Sobrecarga Progresiva es tu Mejor Amiga',
        content: 'Para seguir progresando, debes aumentar gradualmente el estímulo: más peso, más repeticiones, más series o menos descanso.',
    },
    {
        title: 'La Sal es Necesaria',
        content: 'No elimines la sal por completo, especialmente si sudas mucho. El sodio es un electrolito crucial para la contracción muscular.',
    },
];
// Recomendaciones por categoría
export const TIPS_CATEGORIES = {
    '🥗 Nutrición': [
        {
            title: 'La Magia de las Proteínas',
            content: 'No solo construyen músculo, también te mantienen saciado por más tiempo. Asegúrate de incluir una fuente de proteína en cada comida principal (entre 30-40g).',
        },
        {
            title: 'Grasas, las buenas amigas',
            content: 'Aguacates, nueces, aceite de oliva... No temas a las grasas saludables. Son esenciales para la producción hormonal (incluida la testosterona) y la salud cerebral.',
        },
    ],
    '💪 Técnica': [
        {
            title: 'Conexión Mente-Músculo',
            content: 'No solo muevas el peso. Concéntrate activamente en el músculo que estás trabajando. Siente la contracción y el estiramiento en cada repetición.',
        },
        {
            title: 'Tempo es la clave',
            content: 'Prueba a bajar el peso más lentamente (fase excéntrica) de lo que lo subes. Un tempo de 3-1-1 (3s para bajar, 1s de pausa, 1s para subir) puede disparar tus ganancias.',
        },
        {
            title: 'Sobrecarga Progresiva',
            content: 'Para crecer, debes retar a tus músculos constantemente. Intenta añadir un poco más de peso o hacer una repetición más que la semana anterior en tus ejercicios principales.',
        },
    ],
    '🧘 Recuperación': [
        {
            title: 'El Poder del Sueño',
            content: 'Dormir menos de 7 horas puede reducir drásticamente tu testosterona y aumentar el cortisol (la hormona del estrés). Prioriza tu descanso como si fuera un entrenamiento más.',
        },
        {
            title: 'Días de Descanso Activo',
            content: 'No tienes que quedarte en el sofá. Una caminata ligera, yoga o estiramientos suaves en tus días libres mejoran el flujo sanguíneo y aceleran la recuperación muscular.',
        },
    ],
    '🧠 Mindset': [
        {
            title: 'Celebra las Pequeñas Victorias',
            content: '¿Levantaste 1kg más que la semana pasada? ¿Hiciste una repetición extra? Celébralo. El progreso no siempre es un salto gigante, es una acumulación de pequeños pasos.',
        },
        {
            title: 'No te compares con los demás',
            content: 'Tu viaje es único. La única persona con la que debes compararte es con quien eras ayer. Concéntrate en tu propio progreso y disfruta del proceso.',
        },
    ],
};
// URLs de guías de ejercicios (GIFs)
export const EXERCISE_GUIDES = {
    'Press Banca': 'https://i.imgur.com/g6QF5H3.gif',
    'Press Inclinado con Mancuernas': 'https://i.imgur.com/zS4St5I.gif',
    'Aperturas en Polea Alta': 'https://i.imgur.com/2N1sS80.gif',
    'Press Francés': 'https://i.imgur.com/bDAA3sH.gif',
    'Extensiones de Tríceps en Polea': 'https://i.imgur.com/13sH228.gif',
    Flexiones: 'https://i.imgur.com/sMTrA28.gif',
    'Dominadas / Jalón al Pecho': 'https://i.imgur.com/5Ltr14w.gif',
    'Remo con Barra': 'https://i.imgur.com/aThhdF0.gif',
    'Remo Gironda (Polea Baja)': 'https://i.imgur.com/3ZgI2z4.gif',
    'Face Pull': 'https://i.imgur.com/Si72g2L.gif',
    'Curl con Barra Z': 'https://i.imgur.com/495sF6Y.gif',
    'Curl Martillo': 'https://i.imgur.com/bse7a4H.gif',
    'Sentadilla Libre': 'https://i.imgur.com/k2j3tYW.gif',
    'Prensa Inclinada': 'https://i.imgur.com/m2iT4zY.gif',
    'Zancadas con Mancuernas': 'https://i.imgur.com/gJ5j4uY.gif',
    'Extensiones de Cuádriceps': 'https://i.imgur.com/JjYtGj0.gif',
    'Elevación de Talones de pie': 'https://i.imgur.com/P0O3pU4.gif',
    'Press Militar con Barra': 'https://i.imgur.com/1vWqQoX.gif',
    'Elevaciones Laterales con Mancuernas': 'https://i.imgur.com/ALg0xG2.gif',
    'Pájaros (Elevaciones Posteriores)': 'https://i.imgur.com/y8F42a6.gif',
    'Remo al Mentón': 'https://i.imgur.com/kS5SAp3.gif',
    'Encogimientos con Mancuernas': 'https://i.imgur.com/yVqX9oN.gif',
    'Peso Muerto Rumano': 'https://i.imgur.com/YjGk2xQ.gif',
    'Curl Femoral Tumbado': 'https://i.imgur.com/dEaDROS.gif',
    'Hip Thrust': 'https://i.imgur.com/gH1lKqZ.gif',
    'Prensa Horizontal (pies altos)': 'https://i.imgur.com/nOLsM3J.gif',
    'Elevación de Piernas Colgado': 'https://i.imgur.com/VXMh8A6.gif',
    'Plancha con peso': 'https://i.imgur.com/V32sB0S.gif',
};
// Nota: Los datos de DIET_DATA y WORKOUT_DATA son enormes (1600+ líneas del HTML original)
// Se cargan desde archivos separados en src/constants/dietData.ts y workoutData.ts
