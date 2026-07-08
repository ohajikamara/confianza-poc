import { Bilingual, BigButton, Screen, Card } from './ui'

export default function Welcome({ onStart, hasSnapshot, onResume }) {
  return (
    <Screen>
      <div className="flex-1 flex flex-col justify-center rise-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-teal-brand text-white text-3xl font-bold mb-4 shadow-lg shadow-teal-brand/25">
            C
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-teal-deep">Confianza</h1>
          <p className="text-ink-soft mt-1">English, built around how YOU learn.</p>
          <p className="text-ink-soft/80 text-sm italic">Inglés, construido alrededor de cómo aprendes TÚ.</p>
        </div>

        <Card className="mb-6">
          <Bilingual
            en="There are no wrong answers here. We are learning how YOU learn."
            es="Aquí no hay respuestas incorrectas. Estamos aprendiendo cómo aprendes TÚ."
            size="lg"
          />
          <p className="text-sm text-ink-soft mt-3">
            A few friendly questions (about 3 minutes), then five tiny English lessons made for you.
          </p>
          <p className="text-xs text-ink-soft/80 italic mt-1">
            Unas preguntas amigables (unos 3 minutos), y luego cinco mini-lecciones de inglés hechas para ti.
          </p>
        </Card>

        <div className="space-y-3">
          {hasSnapshot && (
            <BigButton onClick={onResume} variant="amber">
              <span className="font-semibold">Continue where I left off</span>
              <span className="block text-sm opacity-90">Continuar donde quedé</span>
            </BigButton>
          )}
          <BigButton onClick={onStart}>
            <span className="font-semibold">{hasSnapshot ? 'Start fresh' : "Let's begin"}</span>
            <span className="block text-sm opacity-90">{hasSnapshot ? 'Empezar de nuevo' : 'Empecemos'}</span>
          </BigButton>
        </div>
      </div>
    </Screen>
  )
}
