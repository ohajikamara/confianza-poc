/*
  THE LEARNING COMBINATION ASSESSMENT
  -----------------------------------
  24 questions, five blocks. One question per screen, no timer, and every
  question gets an automatic "Not sure / No estoy seguro" option (added by
  the Assessment component; it applies no effects and is never penalised).

  HOW EFFECTS WORK (for the teaching lead):
  Each option carries `effects`: a map of profile paths → increments.
  - modality.* points accumulate and are normalised at the end, so only the
    RELATIVE sizes matter. A strong single-channel answer gives ~1.0 to one
    channel; an honest "combination" answer spreads 0.3–0.4 across several.
  - affective.* values start at 0.5 and shift by the increment (clamped 0–1).
    Example: choosing "I feel like giving up" shifts frustrationTolerance
    −0.2 and confidence −0.1.
  - pace.* / cognitive.* answers SET the value directly (last answer wins).
  - "mixedFlag": true marks the learner as a mixed-mode combination learner
    (our primary persona) — it softens how we describe them at the reveal.
  - "placement": 1 or 0 records a correct/incorrect placement item.
*/

export const BLOCK_LABELS = {
  A: { en: 'How you learn', es: 'Cómo aprendes' },
  B: { en: 'How it feels', es: 'Cómo se siente' },
  C: { en: 'Your rhythm', es: 'Tu ritmo' },
  D: { en: 'Your style', es: 'Tu estilo' },
  E: { en: 'What you already know', es: 'Lo que ya sabes' },
}

export const QUESTIONS = [
  /* ---------- BLOCK A: MODALITY MIX (9 questions) ----------
     Scenario-based, never "are you a visual learner". Every question
     allows a MIX answer that spreads weight across channels. */
  {
    id: 'a1',
    block: 'A',
    en: "Imagine you get a new phone and don't know how to use a feature. What do you reach for first?",
    es: 'Imagina que tienes un celular nuevo y no sabes usar una función. ¿Qué haces primero?',
    options: [
      { en: 'Just start pressing things and see what happens', es: 'Empiezo a tocar botones a ver qué pasa', effects: { 'modality.experimenting': 0.7, 'modality.doing': 0.5 } },
      { en: 'Watch someone show me', es: 'Veo cómo alguien me lo muestra', effects: { 'modality.watching': 1.0 } },
      { en: 'Read the instructions', es: 'Leo las instrucciones', effects: { 'modality.reading': 1.0 } },
      { en: 'Ask someone to guide me step by step', es: 'Pido que me guíen paso a paso', effects: { 'modality.stepByStep': 1.0 } },
      { en: 'Depends on my mood that day', es: 'Depende de mi ánimo ese día', effects: { 'modality.experimenting': 0.25, 'modality.watching': 0.25, 'modality.reading': 0.25, 'modality.stepByStep': 0.25, 'mixedFlag': true } },
    ],
  },
  {
    id: 'a2',
    block: 'A',
    en: "When something finally makes sense to you, it's usually because...",
    es: 'Cuando algo por fin te hace clic, normalmente es porque...',
    options: [
      { en: 'I tried it with my own hands', es: 'Lo intenté con mis propias manos', effects: { 'modality.doing': 1.0 } },
      { en: 'I saw a good example of it', es: 'Vi un buen ejemplo', effects: { 'modality.watching': 1.0 } },
      { en: 'Someone explained it clearly in words', es: 'Alguien me lo explicó claramente', effects: { 'modality.reading': 1.0 } },
      { en: 'I went back to it a second time', es: 'Volví a verlo una segunda vez', effects: { 'modality.reviewing': 1.0 } },
      { en: 'A little of all of those', es: 'Un poco de todo eso', effects: { 'modality.doing': 0.3, 'modality.watching': 0.3, 'modality.reading': 0.3, 'modality.reviewing': 0.3, 'mixedFlag': true } },
    ],
  },
  {
    id: 'a3',
    block: 'A',
    en: 'You learned something new last week. How will you make sure you still know it next month?',
    es: 'Aprendiste algo nuevo la semana pasada. ¿Cómo te aseguras de recordarlo el próximo mes?',
    options: [
      { en: 'Use it in real life as soon as possible', es: 'Usarlo en la vida real lo antes posible', effects: { 'modality.doing': 1.0 } },
      { en: 'Go over my notes again from time to time', es: 'Repasar mis notas de vez en cuando', effects: { 'modality.reviewing': 1.0 } },
      { en: 'Explain it to someone else', es: 'Explicárselo a otra persona', effects: { 'modality.reviewing': 0.6, 'modality.doing': 0.5 } },
      { en: 'Honestly, if I understood it once, it stays', es: 'La verdad, si lo entendí una vez, se queda', effects: { 'modality.reading': 0.5, 'affective.confidence': 0.05 } },
    ],
  },
  {
    id: 'a4',
    block: 'A',
    en: 'A friend wants to teach you a card game. What works best?',
    es: 'Un amigo quiere enseñarte un juego de cartas. ¿Qué funciona mejor?',
    options: [
      { en: "Deal me in — I'll learn while we play", es: 'Reparte — aprendo mientras jugamos', effects: { 'modality.doing': 0.7, 'modality.experimenting': 0.5 } },
      { en: 'Let me watch one round first', es: 'Déjame ver una ronda primero', effects: { 'modality.watching': 1.0 } },
      { en: 'Explain the rules before we start', es: 'Explícame las reglas antes de empezar', effects: { 'modality.reading': 0.6, 'modality.stepByStep': 0.5 } },
      { en: 'Teach me one rule at a time as they come up', es: 'Enséñame una regla a la vez cuando aparezcan', effects: { 'modality.stepByStep': 1.0 } },
    ],
  },
  {
    id: 'a5',
    block: 'A',
    en: 'You have to cook a dish you have never made. What do you do?',
    es: 'Tienes que cocinar un plato que nunca has hecho. ¿Qué haces?',
    options: [
      { en: 'Watch a video of someone making it', es: 'Veo un video de alguien haciéndolo', effects: { 'modality.watching': 1.0 } },
      { en: 'Follow a written recipe carefully', es: 'Sigo una receta escrita con cuidado', effects: { 'modality.reading': 0.7, 'modality.stepByStep': 0.5 } },
      { en: 'Read it once, then improvise', es: 'La leo una vez y luego improviso', effects: { 'modality.experimenting': 0.7, 'modality.reading': 0.4 } },
      { en: 'Cook it alongside someone who knows how', es: 'Lo cocino junto a alguien que sabe', effects: { 'modality.doing': 0.6, 'modality.watching': 0.5 } },
    ],
  },
  {
    id: 'a6',
    block: 'A',
    en: 'When you get something wrong, what helps you most afterwards?',
    es: 'Cuando te equivocas, ¿qué te ayuda más después?',
    options: [
      { en: 'Trying it again right away', es: 'Intentarlo de nuevo enseguida', effects: { 'modality.doing': 0.7, 'modality.experimenting': 0.4 } },
      { en: 'Seeing the correct version done well', es: 'Ver la versión correcta bien hecha', effects: { 'modality.watching': 1.0 } },
      { en: 'Understanding WHY it was wrong', es: 'Entender POR QUÉ estaba mal', effects: { 'modality.reading': 1.0 } },
      { en: 'Coming back to it later with fresh eyes', es: 'Volver más tarde con ojos frescos', effects: { 'modality.reviewing': 1.0 } },
    ],
  },
  {
    id: 'a7',
    block: 'A',
    en: 'Your ideal way to spend 10 minutes learning English would be...',
    es: 'Tu forma ideal de pasar 10 minutos aprendiendo inglés sería...',
    options: [
      { en: 'A little conversation practice, even if I make mistakes', es: 'Practicar conversación, aunque me equivoque', effects: { 'modality.doing': 1.0 } },
      { en: 'Listening to short dialogues and following along', es: 'Escuchar diálogos cortos y seguirlos', effects: { 'modality.watching': 1.0 } },
      { en: 'Studying a clear mini-lesson with notes', es: 'Estudiar una mini-lección clara con apuntes', effects: { 'modality.reading': 0.7, 'modality.stepByStep': 0.4 } },
      { en: 'Playing with words and seeing what sounds right', es: 'Jugar con palabras a ver qué suena bien', effects: { 'modality.experimenting': 1.0 } },
      { en: 'A mix — variety keeps me interested', es: 'Una mezcla — la variedad me mantiene interesado', effects: { 'modality.doing': 0.3, 'modality.watching': 0.3, 'modality.reading': 0.3, 'modality.experimenting': 0.3, 'mixedFlag': true } },
    ],
  },
  {
    id: 'a8',
    block: 'A',
    en: 'Think of something you are genuinely good at. How did you get good?',
    es: 'Piensa en algo que haces muy bien. ¿Cómo llegaste a hacerlo bien?',
    options: [
      { en: 'Lots and lots of practice', es: 'Mucha, mucha práctica', effects: { 'modality.doing': 1.0 } },
      { en: 'Copying people who were better than me', es: 'Copiando a personas mejores que yo', effects: { 'modality.watching': 1.0 } },
      { en: 'Studying it properly', es: 'Estudiándolo en serio', effects: { 'modality.reading': 1.0 } },
      { en: 'Trial and error until it clicked', es: 'Ensayo y error hasta que hizo clic', effects: { 'modality.experimenting': 1.0 } },
      { en: 'Honestly, a combination of all of that', es: 'La verdad, una combinación de todo eso', effects: { 'modality.doing': 0.3, 'modality.watching': 0.3, 'modality.reading': 0.3, 'modality.experimenting': 0.3, 'mixedFlag': true } },
    ],
  },
  {
    id: 'a9',
    block: 'A',
    en: 'Before an important task, you feel most ready when...',
    es: 'Antes de una tarea importante, te sientes más listo cuando...',
    options: [
      { en: 'I have rehearsed it at least once', es: 'La he ensayado al menos una vez', effects: { 'modality.doing': 0.6, 'modality.reviewing': 0.5 } },
      { en: 'I have seen how others do it', es: 'He visto cómo lo hacen otros', effects: { 'modality.watching': 1.0 } },
      { en: 'I have a clear plan written down', es: 'Tengo un plan claro por escrito', effects: { 'modality.reading': 0.5, 'modality.stepByStep': 0.6 } },
      { en: 'I have reviewed everything the night before', es: 'He repasado todo la noche anterior', effects: { 'modality.reviewing': 1.0 } },
    ],
  },

  /* ---------- BLOCK B: AFFECTIVE PROFILE (7 questions) ----------
     The heart of the assessment. Gentle wording, Spanish support on
     every item. These set the emotional dials the EI engine reads. */
  {
    id: 'b1',
    block: 'B',
    en: 'How does it feel when you make a mistake in front of other people?',
    es: '¿Cómo se siente equivocarte delante de otras personas?',
    options: [
      { en: "I laugh it off — it's part of learning", es: 'Me río — es parte de aprender', effects: { 'affective.shameResponse': -0.2, 'affective.socialComfort': 0.15 } },
      { en: 'A little uncomfortable, but I get over it', es: 'Un poco incómodo, pero se me pasa', effects: { 'affective.shameResponse': -0.05 } },
      { en: 'I think about it for the rest of the day', es: 'Lo pienso el resto del día', effects: { 'affective.shameResponse': 0.15, 'affective.socialComfort': -0.1 } },
      { en: 'It makes me want to disappear', es: 'Me dan ganas de desaparecer', effects: { 'affective.shameResponse': 0.25, 'affective.socialComfort': -0.15, 'affective.confidence': -0.05 } },
    ],
  },
  {
    id: 'b2',
    block: 'B',
    en: 'When something is hard and you keep getting it wrong, what usually happens?',
    es: 'Cuando algo es difícil y sigues fallando, ¿qué suele pasar?',
    options: [
      { en: 'I get more determined', es: 'Me pongo más decidido', effects: { 'affective.frustrationTolerance': 0.2, 'affective.confidence': 0.05 } },
      { en: 'I take a break and come back', es: 'Tomo un descanso y vuelvo', effects: { 'affective.frustrationTolerance': 0.1 } },
      { en: 'I feel like giving up', es: 'Me dan ganas de rendirme', effects: { 'affective.frustrationTolerance': -0.2, 'affective.confidence': -0.1 } },
      { en: 'I feel embarrassed even if nobody is watching', es: 'Me da pena aunque nadie me vea', effects: { 'affective.frustrationTolerance': -0.1, 'affective.shameResponse': 0.2 } },
    ],
  },
  {
    id: 'b3',
    block: 'B',
    en: 'When a teacher corrects you, what works best?',
    es: 'Cuando un profesor te corrige, ¿qué funciona mejor?',
    options: [
      { en: 'Tell me directly — I want to know', es: 'Dímelo directo — quiero saberlo', effects: { 'affective.correctionSensitivity': -0.25 } },
      { en: 'Show me the right way, without saying I was wrong', es: 'Muéstrame la forma correcta, sin decir que me equivoqué', effects: { 'affective.correctionSensitivity': 0.15 } },
      { en: 'Let me find the mistake myself', es: 'Déjame encontrar el error yo mismo', effects: { 'affective.correctionSensitivity': 0.05, 'modality.experimenting': 0.4 } },
    ],
  },
  {
    id: 'b4',
    block: 'B',
    en: 'Right now, how confident do you feel about speaking English?',
    es: 'Ahora mismo, ¿qué tan seguro te sientes hablando inglés?',
    options: [
      { en: 'I freeze completely', es: 'Me congelo por completo', effects: { 'affective.confidence': -0.3 } },
      { en: 'Very nervous, but I want to try', es: 'Muy nervioso, pero quiero intentar', effects: { 'affective.confidence': -0.15 } },
      { en: 'Somewhere in the middle', es: 'Un punto medio', effects: {} },
      { en: 'A little nervous, mostly excited', es: 'Un poco nervioso, más que todo emocionado', effects: { 'affective.confidence': 0.15 } },
      { en: 'Bring it on', es: 'Que venga lo que sea', effects: { 'affective.confidence': 0.3 } },
    ],
  },
  {
    id: 'b5',
    block: 'B',
    en: 'Do you prefer to practise where others can see your progress, or completely privately?',
    es: '¿Prefieres practicar donde otros vean tu progreso, o en total privacidad?',
    options: [
      { en: 'With others — it motivates me', es: 'Con otros — me motiva', effects: { 'affective.socialComfort': 0.25 } },
      { en: 'A small trusted group is fine', es: 'Un grupo pequeño de confianza está bien', effects: { 'affective.socialComfort': 0.1 } },
      { en: 'Completely private, at least for now', es: 'Totalmente privado, al menos por ahora', effects: { 'affective.socialComfort': -0.25 } },
    ],
  },
  {
    id: 'b6',
    block: 'B',
    en: 'You answer a question and get it almost right. What do you want to hear?',
    es: 'Respondes una pregunta y casi aciertas. ¿Qué quieres escuchar?',
    options: [
      { en: '"Not quite — here is the exact problem"', es: '«No exactamente — este es el problema exacto»', effects: { 'affective.correctionSensitivity': -0.2 } },
      { en: '"So close! Listen to how it should sound"', es: '«¡Casi! Escucha cómo debería sonar»', effects: { 'affective.correctionSensitivity': 0.1 } },
      { en: '"Good try — want to give it another go?"', es: '«Buen intento — ¿quieres intentarlo otra vez?»', effects: { 'affective.correctionSensitivity': 0.2 } },
    ],
  },
  {
    id: 'b7',
    block: 'B',
    en: 'Be honest: what has stopped you from learning English before?',
    es: 'Sé honesto: ¿qué te ha frenado antes para aprender inglés?',
    options: [
      { en: 'Fear of sounding silly', es: 'Miedo a sonar ridículo', effects: { 'affective.shameResponse': 0.2, 'affective.confidence': -0.1 } },
      { en: 'I lose motivation when it gets hard', es: 'Pierdo la motivación cuando se pone difícil', effects: { 'affective.frustrationTolerance': -0.15 } },
      { en: 'Time — life gets in the way', es: 'El tiempo — la vida se atraviesa', effects: { 'pace.sessionLength': 'short' } },
      { en: 'Boring classes that were not made for me', es: 'Clases aburridas que no eran para mí', effects: { 'affective.frustrationTolerance': 0.05 } },
      { en: 'Nothing — this is my first real try', es: 'Nada — este es mi primer intento real', effects: { 'affective.confidence': 0.05 } },
    ],
  },

  /* ---------- BLOCK C: PACE (2 questions) ---------- */
  {
    id: 'c1',
    block: 'C',
    en: 'Which sounds more like you when learning something new?',
    es: '¿Cuál suena más a ti cuando aprendes algo nuevo?',
    options: [
      { en: 'Move fast, make mistakes, fix them as I go', es: 'Avanzar rápido, cometer errores, corregir sobre la marcha', effects: { 'pace.style': 'fastRisky', 'affective.frustrationTolerance': 0.05 } },
      { en: 'Slow and sure — I want each step solid', es: 'Lento y seguro — quiero cada paso firme', effects: { 'pace.style': 'slowSure' } },
      { en: 'Depends on the day and the topic', es: 'Depende del día y del tema', effects: { 'pace.style': 'adaptive' } },
    ],
  },
  {
    id: 'c2',
    block: 'C',
    en: 'How long is a good learning session for you?',
    es: '¿Cuánto dura una buena sesión de estudio para ti?',
    options: [
      { en: 'Short and focused — 5 minutes is perfect', es: 'Corta y enfocada — 5 minutos es perfecto', effects: { 'pace.sessionLength': 'short' } },
      { en: '10 to 15 minutes when I get into it', es: 'De 10 a 15 minutos cuando me concentro', effects: { 'pace.sessionLength': 'medium' } },
    ],
  },

  /* ---------- BLOCK D: COGNITIVE STYLE (2 questions) ---------- */
  {
    id: 'd1',
    block: 'D',
    en: 'When starting something new, what do you want first?',
    es: 'Al empezar algo nuevo, ¿qué quieres primero?',
    options: [
      { en: 'The big picture — why it matters and where it goes', es: 'La visión general — por qué importa y a dónde va', effects: { 'cognitive.orientation': 'bigPicture' } },
      { en: 'The details — exactly what to do, piece by piece', es: 'Los detalles — exactamente qué hacer, pieza por pieza', effects: { 'cognitive.orientation': 'detailsFirst', 'modality.stepByStep': 0.4 } },
      { en: 'Both — a quick overview, then the details', es: 'Ambos — un vistazo rápido y luego los detalles', effects: { 'cognitive.orientation': 'mixed' } },
    ],
  },
  {
    id: 'd2',
    block: 'D',
    en: 'For grammar, which teacher would you pick?',
    es: 'Para la gramática, ¿qué profesor elegirías?',
    options: [
      { en: 'One who explains the rule clearly first', es: 'Uno que explica la regla claramente primero', effects: { 'cognitive.grammarMode': 'explained' } },
      { en: 'One who shows examples and lets me feel the pattern', es: 'Uno que muestra ejemplos y me deja sentir el patrón', effects: { 'cognitive.grammarMode': 'shownByExample' } },
      { en: 'A bit of both, depending on the topic', es: 'Un poco de ambos, según el tema', effects: { 'cognitive.grammarMode': 'mixed' } },
    ],
  },

  /* ---------- BLOCK E: QUICK ENGLISH PLACEMENT (4 items) ----------
     Framed as "you probably know more than you think". Purely to confirm
     beginner level and seed the difficulty band. "placement": 1 = correct. */
  {
    id: 'e1',
    block: 'E',
    en: 'Someone says "Good morning!" — what are they doing?',
    es: 'Alguien dice "Good morning!" — ¿qué está haciendo?',
    options: [
      { en: 'Saying hello', es: 'Saludando', effects: { placement: 1 } },
      { en: 'Saying goodbye', es: 'Despidiéndose', effects: { placement: 0 } },
      { en: 'Asking a question', es: 'Haciendo una pregunta', effects: { placement: 0 } },
    ],
  },
  {
    id: 'e2',
    block: 'E',
    en: 'Which one is correct?',
    es: '¿Cuál es correcta?',
    options: [
      { en: 'She is my friend', es: '—', effects: { placement: 1 } },
      { en: 'She are my friend', es: '—', effects: { placement: 0 } },
      { en: 'She am my friend', es: '—', effects: { placement: 0 } },
    ],
  },
  {
    id: 'e3',
    block: 'E',
    en: '"I have two brothers." — What does this person have?',
    es: '"I have two brothers." — ¿Qué tiene esta persona?',
    options: [
      { en: 'Two brothers / Dos hermanos', es: '—', effects: { placement: 1 } },
      { en: 'Two houses / Dos casas', es: '—', effects: { placement: 0 } },
      { en: 'Two jobs / Dos trabajos', es: '—', effects: { placement: 0 } },
    ],
  },
  {
    id: 'e4',
    block: 'E',
    en: 'How do you ask for a coffee politely?',
    es: '¿Cómo pides un café con cortesía?',
    options: [
      { en: 'A coffee, please', es: '—', effects: { placement: 1 } },
      { en: 'Coffee me now', es: '—', effects: { placement: 0 } },
      { en: 'You coffee give', es: '—', effects: { placement: 0 } },
    ],
  },
]
