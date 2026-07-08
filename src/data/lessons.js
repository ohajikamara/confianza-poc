/*
  THE ADAPTIVE MICRO-COURSE — five A1 lessons, 3–5 minutes each.

  Every lesson has five beats in this order (comprehension before production):
    1. warmup      — one sentence connecting to real life in Barranquilla
    2. input       — 3–6 target phrases (SpeechSynthesis + text + Spanish gloss)
                     preceded by the CONCEPT, taught in the selected VARIANT
    3. check       — 2–3 gentle multiple-choice comprehension items
    4. mission     — a tiny real-world task where the learner USES the language
    5. reflection  — emotion chips feeding the EI engine + specific praise

  CONTENT VARIANTS (what makes switching possible):
  Each lesson's core concept is authored in FIVE explanation modes. The
  profile picks the default (see profile.js → defaultVariantFor); the EI
  engine can OVERRIDE mid-lesson — e.g. an atRisk learner is switched to
  stepByStep no matter what the quiz said.
    exampleFirst — shows examples, lets the pattern emerge
    ruleFirst    — brief clear explanation, then examples
    story        — a short narrative scene using the phrase
    stepByStep   — one small piece at a time, learner confirms each step
    tryIt        — throws a task first, then teaches from the attempt

  DIFFICULTY TIERS on comprehension items:
    support  — 2 options + a hint shown up front (comprehensible-input floor)
    standard — 3 options
    stretch  — all 4 options, no hint
  The engine keeps the learner in the 90–98% success band: below 80% → drop
  to support; above 98% with fast answers → offer stretch.
*/

export const LESSONS = [
  /* ================= LESSON 1: GREETINGS ================= */
  {
    id: 'greetings',
    number: 1,
    title: { en: 'Greetings & saying hello', es: 'Saludos y decir hola' },
    achievement: { en: 'You can greet someone in English.', es: 'Puedes saludar a alguien en inglés.' },
    warmup: {
      en: "It's 7am on Carrera 53 in Barranquilla. Your neighbour waves at you — but today, you answer in English.",
      es: 'Son las 7am en la Carrera 53 de Barranquilla. Tu vecino te saluda — pero hoy, respondes en inglés.',
    },
    phrases: [
      { en: 'Hello!', es: '¡Hola!' },
      { en: 'Hi! Good morning!', es: '¡Hola! ¡Buenos días!' },
      { en: 'How are you?', es: '¿Cómo estás?' },
      { en: "I'm fine, thanks. And you?", es: 'Estoy bien, gracias. ¿Y tú?' },
    ],
    concept: {
      id: 'greetings_how_are_you',
      focus: { en: 'The greeting exchange', es: 'El intercambio de saludos' },
      variants: {
        exampleFirst: {
          cards: [
            { en: '— Hello! How are you?  — I\'m fine, thanks!', es: '— ¡Hola! ¿Cómo estás? — ¡Bien, gracias!' },
            { en: '— Hi! How are you?  — I\'m fine. And you?', es: '— ¡Hola! ¿Cómo estás? — Bien. ¿Y tú?' },
            { en: '— Good morning! How are you?  — Fine, thanks!', es: '— ¡Buenos días! ¿Cómo estás? — ¡Bien, gracias!' },
            { en: 'See the pattern? Greeting → "How are you?" → "I\'m fine, thanks."', es: '¿Ves el patrón? Saludo → «How are you?» → «I\'m fine, thanks.»' },
          ],
        },
        ruleFirst: {
          cards: [
            { en: 'English greetings come in a pair: someone greets, you greet back and add "How are you?"', es: 'Los saludos en inglés vienen en pareja: alguien saluda, tú respondes y agregas «How are you?»' },
            { en: 'The standard answer is "I\'m fine, thanks" — even on an average day. It keeps things friendly.', es: 'La respuesta estándar es «I\'m fine, thanks» — incluso en un día normal. Mantiene la cordialidad.' },
            { en: 'Example: — Hi! How are you?  — I\'m fine, thanks. And you?', es: 'Ejemplo: — Hi! How are you? — I\'m fine, thanks. And you?' },
          ],
        },
        story: {
          cards: [
            { en: 'María steps into the elevator. Her new neighbour smiles: "Good morning! How are you?"', es: 'María entra al ascensor. Su vecino nuevo sonríe: «Good morning! How are you?»' },
            { en: 'She takes a breath and says: "I\'m fine, thanks. And you?" — Her first conversation in English. Done.', es: 'Ella respira y dice: «I\'m fine, thanks. And you?» — Su primera conversación en inglés. Lista.' },
          ],
        },
        stepByStep: {
          cards: [
            { en: 'Step 1: The greeting. "Hello" or "Hi". That\'s it — one word.', es: 'Paso 1: El saludo. «Hello» o «Hi». Eso es todo — una palabra.' },
            { en: 'Step 2: The question. "How are you?" — it means ¿Cómo estás?', es: 'Paso 2: La pregunta. «How are you?» — significa ¿Cómo estás?' },
            { en: 'Step 3: The answer. "I\'m fine, thanks." — Estoy bien, gracias.', es: 'Paso 3: La respuesta. «I\'m fine, thanks.» — Estoy bien, gracias.' },
            { en: 'Step 4: Return the question: "And you?" — Now you have the whole exchange.', es: 'Paso 4: Devuelve la pregunta: «And you?» — Ya tienes el intercambio completo.' },
          ],
        },
        tryIt: {
          try: {
            prompt: { en: 'Someone says "How are you?" — what feels like the right reply? Just guess!', es: 'Alguien dice «How are you?» — ¿cuál te parece la respuesta correcta? ¡Solo adivina!' },
            options: [
              { en: "I'm fine, thanks.", correct: true },
              { en: 'Yes, hello.', correct: false },
              { en: 'Good night.', correct: false },
            ],
          },
          cards: [
            { en: '"How are you?" asks how you feel — so the reply is "I\'m fine, thanks."', es: '«How are you?» pregunta cómo te sientes — así que la respuesta es «I\'m fine, thanks.»' },
            { en: 'Add "And you?" to send the question back. Friendly and complete.', es: 'Agrega «And you?» para devolver la pregunta. Amable y completo.' },
          ],
        },
      },
    },
    check: [
      {
        id: 'g1',
        prompt: { en: 'Someone says "Good morning!" What time of day is it?', es: 'Alguien dice «Good morning!» ¿Qué momento del día es?' },
        options: [
          { en: 'Morning / La mañana', correct: true },
          { en: 'Night / La noche', correct: false },
          { en: 'Afternoon / La tarde', correct: false },
          { en: 'Midnight / La medianoche', correct: false },
        ],
        hint: { en: '"Morning" sounds like "mañana"... in time, not tomorrow!', es: '«Morning» es la mañana.' },
      },
      {
        id: 'g2',
        prompt: { en: '"How are you?" — what is this person asking?', es: '«How are you?» — ¿qué pregunta esta persona?' },
        options: [
          { en: 'How you feel / Cómo te sientes', correct: true },
          { en: 'Your name / Tu nombre', correct: false },
          { en: 'Where you live / Dónde vives', correct: false },
          { en: 'The time / La hora', correct: false },
        ],
        hint: { en: 'It\'s the question you answer with "I\'m fine".', es: 'Es la pregunta que respondes con «I\'m fine».' },
      },
      {
        id: 'g3',
        prompt: { en: 'What does "I\'m fine, thanks" mean?', es: '¿Qué significa «I\'m fine, thanks»?' },
        options: [
          { en: 'Estoy bien, gracias', correct: true },
          { en: 'No entiendo', correct: false },
          { en: 'Hasta luego', correct: false },
          { en: 'Mucho gusto', correct: false },
        ],
        hint: { en: '"Fine" = bien. "Thanks" = gracias.', es: '«Fine» = bien. «Thanks» = gracias.' },
      },
    ],
    mission: {
      type: 'dialogue',
      setup: { en: 'Your neighbour on Carrera 53 smiles and says:', es: 'Tu vecino de la Carrera 53 sonríe y dice:' },
      line: { en: '"Good morning! How are you?"', es: '«¡Buenos días! ¿Cómo estás?»' },
      prompt: { en: 'You answer in English. Choose your reply:', es: 'Respondes en inglés. Elige tu respuesta:' },
      options: [
        { en: "I'm fine, thanks. And you?", correct: true },
        { en: 'Yes, good morning you are.', correct: false },
        { en: 'Me morning good.', correct: false },
      ],
      praise: { en: 'You just had your first conversation in English. That happened. It\'s real.', es: 'Acabas de tener tu primera conversación en inglés. Pasó. Es real.' },
    },
  },

  /* ================= LESSON 2: INTRODUCING YOURSELF ================= */
  {
    id: 'introductions',
    number: 2,
    title: { en: 'Introducing yourself', es: 'Presentarte' },
    achievement: { en: 'You can introduce yourself.', es: 'Puedes presentarte.' },
    warmup: {
      en: 'A tourist at the Malecón asks who you are. Thirty seconds from now, you can tell them — in English.',
      es: 'Un turista en el Malecón te pregunta quién eres. En treinta segundos, podrás decírselo — en inglés.',
    },
    phrases: [
      { en: 'My name is Ana.', es: 'Mi nombre es Ana.' },
      { en: "I'm from Colombia.", es: 'Soy de Colombia.' },
      { en: 'Nice to meet you!', es: '¡Mucho gusto!' },
      { en: 'Nice to meet you too!', es: '¡Mucho gusto también!' },
    ],
    concept: {
      id: 'intro_my_name_is',
      focus: { en: 'Introducing yourself', es: 'Presentarte' },
      variants: {
        exampleFirst: {
          cards: [
            { en: '"My name is Carlos. I\'m from Barranquilla."', es: '«My name is Carlos. I\'m from Barranquilla.»' },
            { en: '"My name is Luisa. I\'m from Cartagena."', es: '«My name is Luisa. I\'m from Cartagena.»' },
            { en: '"My name is Andrés. I\'m from Colombia."', es: '«My name is Andrés. I\'m from Colombia.»' },
            { en: 'The frame never changes: "My name is ___. I\'m from ___." Just swap the words.', es: 'El molde nunca cambia: «My name is ___. I\'m from ___.» Solo cambia las palabras.' },
          ],
        },
        ruleFirst: {
          cards: [
            { en: 'Two building blocks: "My name is + your name" and "I\'m from + your place".', es: 'Dos bloques: «My name is + tu nombre» y «I\'m from + tu lugar».' },
            { en: '"I\'m" is short for "I am" — soy. So "I\'m from Colombia" = soy de Colombia.', es: '«I\'m» es la forma corta de «I am» — soy. «I\'m from Colombia» = soy de Colombia.' },
            { en: 'When you meet someone: "Nice to meet you!" They reply: "Nice to meet you too!"', es: 'Al conocer a alguien: «Nice to meet you!» Te responden: «Nice to meet you too!»' },
          ],
        },
        story: {
          cards: [
            { en: 'At the Malecón, a traveller points at the sunset and smiles at Sofía. "Beautiful! I\'m Emma. What\'s your name?"', es: 'En el Malecón, una viajera señala el atardecer y le sonríe a Sofía. «Beautiful! I\'m Emma. What\'s your name?»' },
            { en: '"My name is Sofía. I\'m from Barranquilla," she says. "Nice to meet you!" — and just like that, she has a new friend.', es: '«My name is Sofía. I\'m from Barranquilla», dice. «Nice to meet you!» — y así, tiene una nueva amiga.' },
          ],
        },
        stepByStep: {
          cards: [
            { en: 'Step 1: Your name. "My name is ___." Say it with YOUR name.', es: 'Paso 1: Tu nombre. «My name is ___.» Dilo con TU nombre.' },
            { en: 'Step 2: Your place. "I\'m from Colombia." — Soy de Colombia.', es: 'Paso 2: Tu lugar. «I\'m from Colombia.» — Soy de Colombia.' },
            { en: 'Step 3: The friendly finish. "Nice to meet you!" — ¡Mucho gusto!', es: 'Paso 3: El cierre amable. «Nice to meet you!» — ¡Mucho gusto!' },
            { en: 'Put them together and you have a full introduction. Three small pieces.', es: 'Júntalos y tienes una presentación completa. Tres piezas pequeñas.' },
          ],
        },
        tryIt: {
          try: {
            prompt: { en: 'You want to say "Soy de Colombia" in English. Which one feels right? Guess freely!', es: 'Quieres decir «Soy de Colombia» en inglés. ¿Cuál te parece? ¡Adivina sin miedo!' },
            options: [
              { en: "I'm from Colombia.", correct: true },
              { en: 'I Colombia from.', correct: false },
              { en: 'Me is of Colombia.', correct: false },
            ],
          },
          cards: [
            { en: '"I\'m from + place" is the pattern — I\'m from Colombia, I\'m from Barranquilla.', es: '«I\'m from + lugar» es el patrón — I\'m from Colombia, I\'m from Barranquilla.' },
            { en: 'Same trick for your name: "My name is + name". Two moulds, endless introductions.', es: 'El mismo truco con tu nombre: «My name is + nombre». Dos moldes, presentaciones infinitas.' },
          ],
        },
      },
    },
    check: [
      {
        id: 'i1',
        prompt: { en: '"My name is Pedro." — What is this person telling you?', es: '«My name is Pedro.» — ¿Qué te está diciendo esta persona?' },
        options: [
          { en: 'Their name / Su nombre', correct: true },
          { en: 'Their age / Su edad', correct: false },
          { en: 'Their job / Su trabajo', correct: false },
          { en: 'Their city / Su ciudad', correct: false },
        ],
        hint: { en: '"Name" sounds like "nombre".', es: '«Name» = nombre.' },
      },
      {
        id: 'i2',
        prompt: { en: '"I\'m from Colombia" means...', es: '«I\'m from Colombia» significa...' },
        options: [
          { en: 'Soy de Colombia', correct: true },
          { en: 'Voy a Colombia', correct: false },
          { en: 'Me gusta Colombia', correct: false },
          { en: 'Vivo con Colombia', correct: false },
        ],
        hint: { en: '"From" tells you where someone comes FROM — de dónde es.', es: '«From» dice de dónde viene alguien.' },
      },
      {
        id: 'i3',
        prompt: { en: 'You just met someone new. What do you say?', es: 'Acabas de conocer a alguien. ¿Qué dices?' },
        options: [
          { en: 'Nice to meet you!', correct: true },
          { en: 'Good night!', correct: false },
          { en: 'How much is it?', correct: false },
          { en: 'Where is the bank?', correct: false },
        ],
        hint: { en: 'It\'s the phrase that means "mucho gusto".', es: 'Es la frase que significa «mucho gusto».' },
      },
    ],
    mission: {
      type: 'arrange',
      setup: { en: 'The tourist at the Malecón asks your name. Build your answer:', es: 'El turista del Malecón te pregunta tu nombre. Arma tu respuesta:' },
      words: ['My', 'name', 'is', 'Ana'],
      answer: 'My name is Ana',
      praise: { en: 'You introduced yourself in English, word by word, in the right order. That\'s a real sentence you built.', es: 'Te presentaste en inglés, palabra por palabra, en el orden correcto. Esa frase la construiste tú.' },
    },
  },

  /* ================= LESSON 3: ORDERING FOOD & DRINK ================= */
  {
    id: 'ordering',
    number: 3,
    title: { en: 'Ordering food & drink', es: 'Pedir comida y bebida' },
    achievement: { en: 'You can order a coffee.', es: 'Puedes pedir un café.' },
    warmup: {
      en: "You're at a café on Carrera 53. The barista looks up. This time, you order in English.",
      es: 'Estás en un café de la Carrera 53. El barista te mira. Esta vez, pides en inglés.',
    },
    phrases: [
      { en: 'Can I have a coffee, please?', es: '¿Me das un café, por favor?' },
      { en: 'Can I have a water, please?', es: '¿Me das un agua, por favor?' },
      { en: 'How much is it?', es: '¿Cuánto cuesta?' },
      { en: 'Thank you!', es: '¡Gracias!' },
    ],
    concept: {
      id: 'ordering_can_i_have',
      focus: { en: 'Ordering politely', es: 'Pedir con cortesía' },
      variants: {
        exampleFirst: {
          cards: [
            { en: '"Can I have a coffee, please?"', es: '«Can I have a coffee, please?»' },
            { en: '"Can I have a juice, please?"', es: '«Can I have a juice, please?»' },
            { en: '"Can I have an arepa, please?"', es: '«Can I have an arepa, please?»' },
            { en: 'One magic frame: "Can I have a ___, please?" — swap in anything on the menu.', es: 'Un molde mágico: «Can I have a ___, please?» — pon lo que quieras del menú.' },
          ],
        },
        ruleFirst: {
          cards: [
            { en: '"Can I have...?" is the polite way to order — like "¿Me das...?" It works everywhere.', es: '«Can I have...?» es la forma cortés de pedir — como «¿Me das...?» Funciona en todas partes.' },
            { en: 'Structure: Can I have + a + thing + please? The "please" at the end is the politeness.', es: 'Estructura: Can I have + a + cosa + please? El «please» al final es la cortesía.' },
            { en: 'To ask the price: "How much is it?" — ¿Cuánto cuesta?', es: 'Para preguntar el precio: «How much is it?» — ¿Cuánto cuesta?' },
          ],
        },
        story: {
          cards: [
            { en: 'The café on Carrera 53 is busy. Diego approaches the counter, heart beating a little fast. "Can I have a coffee, please?"', es: 'El café de la Carrera 53 está lleno. Diego se acerca al mostrador, con el corazón un poco acelerado. «Can I have a coffee, please?»' },
            { en: 'The barista nods like it\'s the most normal thing in the world. Because it is. "How much is it?" Diego adds. Smooth.', es: 'El barista asiente como si fuera lo más normal del mundo. Porque lo es. «How much is it?», agrega Diego. Sin problema.' },
          ],
        },
        stepByStep: {
          cards: [
            { en: 'Step 1: The opener. "Can I have..." — ¿Me das...? Just those three words.', es: 'Paso 1: La apertura. «Can I have...» — ¿Me das...? Solo esas tres palabras.' },
            { en: 'Step 2: The thing. "...a coffee..." — un café. Add what you want.', es: 'Paso 2: La cosa. «...a coffee...» — un café. Agrega lo que quieres.' },
            { en: 'Step 3: The magic word. "...please?" — por favor. Now it\'s polite.', es: 'Paso 3: La palabra mágica. «...please?» — por favor. Ahora es cortés.' },
            { en: 'All together: "Can I have a coffee, please?" You can order anything with this.', es: 'Todo junto: «Can I have a coffee, please?» Puedes pedir cualquier cosa con esto.' },
          ],
        },
        tryIt: {
          try: {
            prompt: { en: 'You want a coffee at the café. Which one sounds like the polite order? Trust your ear!', es: 'Quieres un café en el café. ¿Cuál suena como el pedido cortés? ¡Confía en tu oído!' },
            options: [
              { en: 'Can I have a coffee, please?', correct: true },
              { en: 'Give coffee now.', correct: false },
              { en: 'I coffee want you.', correct: false },
            ],
          },
          cards: [
            { en: 'Your ear was probably right: "Can I have a coffee, please?" is the polite pattern.', es: 'Tu oído probablemente acertó: «Can I have a coffee, please?» es el patrón cortés.' },
            { en: 'Keep the frame, change the word: a water, a juice, an arepa. One pattern, whole menu.', es: 'Mantén el molde, cambia la palabra: a water, a juice, an arepa. Un patrón, todo el menú.' },
          ],
        },
      },
    },
    check: [
      {
        id: 'o1',
        prompt: { en: '"Can I have a water, please?" — what does this person want?', es: '«Can I have a water, please?» — ¿qué quiere esta persona?' },
        options: [
          { en: 'Water / Agua', correct: true },
          { en: 'Coffee / Café', correct: false },
          { en: 'The bill / La cuenta', correct: false },
          { en: 'A table / Una mesa', correct: false },
        ],
        hint: { en: '"Water" suena como "wa-ter" — agua.', es: '«Water» = agua.' },
      },
      {
        id: 'o2',
        prompt: { en: '"How much is it?" — what are you asking?', es: '«How much is it?» — ¿qué estás preguntando?' },
        options: [
          { en: 'The price / El precio', correct: true },
          { en: 'The time / La hora', correct: false },
          { en: 'The name / El nombre', correct: false },
          { en: 'The size / El tamaño', correct: false },
        ],
        hint: { en: 'You ask it before you pay.', es: 'Lo preguntas antes de pagar.' },
      },
      {
        id: 'o3',
        prompt: { en: 'Which word makes your order polite?', es: '¿Qué palabra hace tu pedido cortés?' },
        options: [
          { en: 'Please', correct: true },
          { en: 'Now', correct: false },
          { en: 'Fast', correct: false },
          { en: 'Me', correct: false },
        ],
        hint: { en: 'It means "por favor".', es: 'Significa «por favor».' },
      },
    ],
    mission: {
      type: 'arrange',
      setup: { en: 'The barista is waiting. Build your order:', es: 'El barista espera. Arma tu pedido:' },
      words: ['Can', 'I', 'have', 'a', 'coffee,', 'please?'],
      answer: 'Can I have a coffee, please?',
      praise: { en: 'You just ordered a coffee in English. That\'s real. Next time it happens for real, you\'re ready.', es: 'Acabas de pedir un café en inglés. Es real. La próxima vez que pase de verdad, estás listo.' },
    },
  },

  /* ================= LESSON 4: ASKING FOR DIRECTIONS ================= */
  {
    id: 'directions',
    number: 4,
    title: { en: 'Asking for directions', es: 'Pedir direcciones' },
    achievement: { en: 'You can ask where something is.', es: 'Puedes preguntar dónde queda algo.' },
    warmup: {
      en: "You're helping a lost tourist near the stadium. They need the bus station — and you understand the answer.",
      es: 'Ayudas a un turista perdido cerca del estadio. Necesita la estación de buses — y tú entiendes la respuesta.',
    },
    phrases: [
      { en: 'Where is the bus station?', es: '¿Dónde está la estación de buses?' },
      { en: 'Turn left.', es: 'Gira a la izquierda.' },
      { en: 'Turn right.', es: 'Gira a la derecha.' },
      { en: 'Go straight ahead.', es: 'Sigue derecho.' },
      { en: "It's near. / It's far.", es: 'Está cerca. / Está lejos.' },
    ],
    concept: {
      id: 'directions_where_is',
      focus: { en: 'Asking and understanding directions', es: 'Preguntar y entender direcciones' },
      variants: {
        exampleFirst: {
          cards: [
            { en: '"Where is the bank?" — "Turn left. It\'s near."', es: '«Where is the bank?» — «Turn left. It\'s near.»' },
            { en: '"Where is the beach?" — "Go straight ahead."', es: '«Where is the beach?» — «Go straight ahead.»' },
            { en: '"Where is the station?" — "Turn right. It\'s far."', es: '«Where is the station?» — «Turn right. It\'s far.»' },
            { en: 'The question is always "Where is the ___?" The answers use left, right, straight.', es: 'La pregunta siempre es «Where is the ___?» Las respuestas usan left, right, straight.' },
          ],
        },
        ruleFirst: {
          cards: [
            { en: '"Where is...?" asks for a place — ¿Dónde está...? Add "the + place".', es: '«Where is...?» pregunta por un lugar — ¿Dónde está...? Agrega «the + lugar».' },
            { en: 'The four direction words: left (izquierda), right (derecha), straight ahead (derecho), near/far (cerca/lejos).', es: 'Las cuatro palabras de dirección: left (izquierda), right (derecha), straight ahead (derecho), near/far (cerca/lejos).' },
            { en: 'Example: "Where is the bus station?" — "Turn left. It\'s near."', es: 'Ejemplo: «Where is the bus station?» — «Turn left. It\'s near.»' },
          ],
        },
        story: {
          cards: [
            { en: 'Outside the stadium, a backpacker turns his map upside down, defeated. Camila walks over: he needs the bus station.', es: 'Frente al estadio, un mochilero gira su mapa al revés, derrotado. Camila se acerca: necesita la estación de buses.' },
            { en: '"Turn right. Go straight ahead. It\'s near!" she says, pointing. He beams. Camila just gave directions in English.', es: '«Turn right. Go straight ahead. It\'s near!», dice ella, señalando. Él sonríe. Camila acaba de dar direcciones en inglés.' },
          ],
        },
        stepByStep: {
          cards: [
            { en: 'Step 1: The question. "Where is the bus station?" — ¿Dónde está...?', es: 'Paso 1: La pregunta. «Where is the bus station?» — ¿Dónde está...?' },
            { en: 'Step 2: Left and right. "Turn left" (izquierda), "Turn right" (derecha). Picture your own hands.', es: 'Paso 2: Izquierda y derecha. «Turn left» (izquierda), «Turn right» (derecha). Imagina tus propias manos.' },
            { en: 'Step 3: Straight. "Go straight ahead" — sigue derecho, no turns.', es: 'Paso 3: Derecho. «Go straight ahead» — sigue derecho, sin girar.' },
            { en: 'Step 4: Distance. "It\'s near" (cerca) or "It\'s far" (lejos). Now you can navigate.', es: 'Paso 4: Distancia. «It\'s near» (cerca) o «It\'s far» (lejos). Ya puedes navegar.' },
          ],
        },
        tryIt: {
          try: {
            prompt: { en: 'A sign says "→". Which English phrase matches it? Take a guess!', es: 'Un letrero dice «→». ¿Qué frase en inglés le corresponde? ¡Adivina!' },
            options: [
              { en: 'Turn right', correct: true },
              { en: 'Turn left', correct: false },
              { en: "It's far", correct: false },
            ],
          },
          cards: [
            { en: 'Right = derecha (→), left = izquierda (←), straight ahead = derecho (↑).', es: 'Right = derecha (→), left = izquierda (←), straight ahead = derecho (↑).' },
            { en: 'And to ask in the first place: "Where is the ___?" — ¿Dónde está...?', es: 'Y para preguntar: «Where is the ___?» — ¿Dónde está...?' },
          ],
        },
      },
    },
    check: [
      {
        id: 'd1',
        prompt: { en: '"Turn left" means...', es: '«Turn left» significa...' },
        options: [
          { en: 'Gira a la izquierda', correct: true },
          { en: 'Gira a la derecha', correct: false },
          { en: 'Sigue derecho', correct: false },
          { en: 'Está lejos', correct: false },
        ],
        hint: { en: 'Left is the side your heart is on.', es: '«Left» es el lado del corazón.' },
      },
      {
        id: 'd2',
        prompt: { en: '"It\'s near" — the place is...', es: '«It\'s near» — el lugar está...' },
        options: [
          { en: 'Close / Cerca', correct: true },
          { en: 'Far / Lejos', correct: false },
          { en: 'Closed / Cerrado', correct: false },
          { en: 'Behind you / Detrás de ti', correct: false },
        ],
        hint: { en: 'Good news for your feet.', es: 'Buenas noticias para tus pies.' },
      },
      {
        id: 'd3',
        prompt: { en: 'You want to find the bank. What do you ask?', es: 'Quieres encontrar el banco. ¿Qué preguntas?' },
        options: [
          { en: 'Where is the bank?', correct: true },
          { en: 'How much is the bank?', correct: false },
          { en: 'Can I have a bank?', correct: false },
          { en: 'How are you, bank?', correct: false },
        ],
        hint: { en: '"Where" = dónde.', es: '«Where» = dónde.' },
      },
    ],
    mission: {
      type: 'dialogue',
      setup: { en: 'The lost tourist shows you their phone: they need the bus station. It\'s two blocks to the right.', es: 'El turista perdido te muestra su celular: necesita la estación de buses. Queda a dos cuadras a la derecha.' },
      line: { en: '"Excuse me — where is the bus station?"', es: '«Disculpa — ¿dónde está la estación de buses?»' },
      prompt: { en: 'Point them the right way:', es: 'Indícale el camino correcto:' },
      options: [
        { en: "Turn right. It's near.", correct: true },
        { en: "Turn left. It's far.", correct: false },
        { en: 'Nice to meet you.', correct: false },
      ],
      praise: { en: 'You just helped someone find their way — in English. Somewhere, a tourist made their bus because of you.', es: 'Acabas de ayudar a alguien a encontrar su camino — en inglés. En algún lugar, un turista alcanzó su bus gracias a ti.' },
    },
  },

  /* ================= LESSON 5: TALKING ABOUT YOURSELF ================= */
  {
    id: 'aboutMe',
    number: 5,
    title: { en: 'Talking about yourself', es: 'Hablar de ti' },
    achievement: { en: 'You can talk about your life.', es: 'Puedes hablar de tu vida.' },
    warmup: {
      en: "Last lesson! At a family asado, a foreign guest wants to know about you. You have the words now.",
      es: '¡Última lección! En un asado familiar, un invitado extranjero quiere saber de ti. Ahora tienes las palabras.',
    },
    phrases: [
      { en: 'I live in Barranquilla.', es: 'Vivo en Barranquilla.' },
      { en: 'I work in a shop.', es: 'Trabajo en una tienda.' },
      { en: 'I like music and football.', es: 'Me gusta la música y el fútbol.' },
      { en: 'I like learning English!', es: '¡Me gusta aprender inglés!' },
    ],
    concept: {
      id: 'about_i_like_i_live',
      focus: { en: 'The "I ___" sentences', es: 'Las frases con «I ___»' },
      variants: {
        exampleFirst: {
          cards: [
            { en: '"I live in Barranquilla." — "I work in a shop." — "I like music."', es: '«I live in Barranquilla.» — «I work in a shop.» — «I like music.»' },
            { en: '"I live in Soledad." — "I work in a hospital." — "I like dancing."', es: '«I live in Soledad.» — «I work in a hospital.» — «I like dancing.»' },
            { en: 'Every sentence starts the same: I + action word. Live, work, like — your whole life in three verbs.', es: 'Cada frase empieza igual: I + verbo. Live, work, like — toda tu vida en tres verbos.' },
          ],
        },
        ruleFirst: {
          cards: [
            { en: 'In English you always say the "I": I live, I work, I like. (In Spanish "vivo" hides the yo — English never hides it.)', es: 'En inglés siempre dices el «I»: I live, I work, I like. (En español «vivo» esconde el yo — el inglés nunca lo esconde.)' },
            { en: 'I live in + place. I work in + place. I like + thing.', es: 'I live in + lugar. I work in + lugar. I like + cosa.' },
            { en: 'Example: "I live in Barranquilla. I work in a shop. I like music."', es: 'Ejemplo: «I live in Barranquilla. I work in a shop. I like music.»' },
          ],
        },
        story: {
          cards: [
            { en: 'At the asado, the smoke rises and the foreign guest asks Julián about his life. He counts on his fingers:', es: 'En el asado, el humo sube y el invitado extranjero le pregunta a Julián por su vida. Él cuenta con los dedos:' },
            { en: '"I live in Barranquilla. I work in a shop. I like football — and now, I like English." Everyone raises their glass.', es: '«I live in Barranquilla. I work in a shop. I like football — and now, I like English.» Todos levantan la copa.' },
          ],
        },
        stepByStep: {
          cards: [
            { en: 'Step 1: Where you live. "I live in Barranquilla." — Vivo en...', es: 'Paso 1: Dónde vives. «I live in Barranquilla.» — Vivo en...' },
            { en: 'Step 2: What you do. "I work in a shop." — Trabajo en...', es: 'Paso 2: Qué haces. «I work in a shop.» — Trabajo en...' },
            { en: 'Step 3: What you love. "I like music." — Me gusta...', es: 'Paso 3: Lo que amas. «I like music.» — Me gusta...' },
            { en: 'Three sentences = a portrait of you. That\'s a real conversation about your life.', es: 'Tres frases = un retrato tuyo. Eso es una conversación real sobre tu vida.' },
          ],
        },
        tryIt: {
          try: {
            prompt: { en: 'How would you say "Vivo en Barranquilla"? Go with your instinct!', es: '¿Cómo dirías «Vivo en Barranquilla»? ¡Sigue tu instinto!' },
            options: [
              { en: 'I live in Barranquilla.', correct: true },
              { en: 'Live Barranquilla I.', correct: false },
              { en: 'In Barranquilla live.', correct: false },
            ],
          },
          cards: [
            { en: 'English always shows the "I" first: I live, I work, I like.', es: 'El inglés siempre muestra el «I» primero: I live, I work, I like.' },
            { en: 'Now stack them: "I live in ___. I work in ___. I like ___." — that\'s you, in English.', es: 'Ahora júntalas: «I live in ___. I work in ___. I like ___.» — ese eres tú, en inglés.' },
          ],
        },
      },
    },
    check: [
      {
        id: 'm1',
        prompt: { en: '"I work in a hospital." — what is this person telling you?', es: '«I work in a hospital.» — ¿qué te está diciendo esta persona?' },
        options: [
          { en: 'Their job place / Dónde trabaja', correct: true },
          { en: 'Where they live / Dónde vive', correct: false },
          { en: 'What they like / Qué le gusta', correct: false },
          { en: 'Where they are going / A dónde va', correct: false },
        ],
        hint: { en: '"Work" = trabajar.', es: '«Work» = trabajar.' },
      },
      {
        id: 'm2',
        prompt: { en: '"I like football" means...', es: '«I like football» significa...' },
        options: [
          { en: 'Me gusta el fútbol', correct: true },
          { en: 'Juego fútbol hoy', correct: false },
          { en: 'Soy futbolista', correct: false },
          { en: 'Veo el fútbol', correct: false },
        ],
        hint: { en: '"Like" = gustar.', es: '«Like» = gustar.' },
      },
      {
        id: 'm3',
        prompt: { en: 'Which sentence says where someone lives?', es: '¿Qué frase dice dónde vive alguien?' },
        options: [
          { en: 'I live in Barranquilla.', correct: true },
          { en: 'I like Barranquilla.', correct: false },
          { en: 'I work in Barranquilla.', correct: false },
          { en: 'Where is Barranquilla?', correct: false },
        ],
        hint: { en: '"Live" = vivir.', es: '«Live» = vivir.' },
      },
    ],
    mission: {
      type: 'arrange',
      setup: { en: 'The guest at the asado asks about your life. Tell them where you live:', es: 'El invitado del asado te pregunta por tu vida. Dile dónde vives:' },
      words: ['I', 'live', 'in', 'Barranquilla'],
      answer: 'I live in Barranquilla',
      praise: { en: 'Five lessons ago you started from hello. Now you just told someone about your life in English. Look at that distance.', es: 'Hace cinco lecciones empezaste con hello. Ahora acabas de contarle tu vida a alguien en inglés. Mira esa distancia.' },
    },
  },
]

/* Reflection chips — the emotional vocabulary shown after every lesson.
   The chip chosen goes straight into the EI engine. */
export const REFLECTION_CHIPS = [
  { id: 'proud', en: 'Proud', es: 'Orgulloso', emoji: '🌟', valence: 1 },
  { id: 'okay', en: 'Okay', es: 'Bien', emoji: '🙂', valence: 0.5 },
  { id: 'confused', en: 'Confused', es: 'Confundido', emoji: '🤔', valence: -0.3 },
  { id: 'frustrated', en: 'Frustrated', es: 'Frustrado', emoji: '😮‍💨', valence: -0.6 },
  { id: 'nervous', en: 'Nervous', es: 'Nervioso', emoji: '😬', valence: -0.4 },
]
