import { NicknameForm } from "@/components/NicknameForm";
import { LEVEL_LABELS } from "@/lib/quiz/levels";
import { assertValidQuestionBank } from "@/lib/quiz/validateBank";

const levels = [
  { label: LEVEL_LABELS.beginner, range: "1–5", topic: "Uso no dia a dia" },
  { label: LEVEL_LABELS.intermediate, range: "6–10", topic: "Customização" },
  { label: LEVEL_LABELS.advanced, range: "11–15", topic: "Integrações avançadas" },
];

export default function Home() {
  // Roda no build (página estática): banco inválido quebra o deploy.
  assertValidQuestionBank();

  return (
    <main className="mx-auto flex w-full max-w-160 flex-1 flex-col justify-center px-4 py-10 sm:py-16">
      <p className="text-sm font-semibold tracking-wide text-accent uppercase">
        Verdadeiro ou Falso
      </p>
      <h1 className="mt-2 font-display text-4xl leading-tight font-semibold sm:text-5xl">
        Quiz Claude Code
      </h1>
      <p className="mt-4 text-lg text-muted">
        Teste e aprenda Claude Code em 15 perguntas de Verdadeiro ou Falso.
      </p>

      <ul className="mt-8 grid gap-3 sm:grid-cols-3" aria-label="Níveis da partida">
        {levels.map((level) => (
          <li key={level.label} className="rounded-xl border border-border bg-surface p-4">
            <p className="text-xs text-muted">Perguntas {level.range}</p>
            <p className="mt-1 font-semibold">{level.label}</p>
            <p className="text-sm text-muted">{level.topic}</p>
          </li>
        ))}
      </ul>

      <p className="mt-6 text-muted">
        A dificuldade aumenta a cada 5 perguntas. Depois de cada resposta você vê a explicação e
        um link para a documentação oficial. Leva uns 5 minutos.
      </p>

      <NicknameForm />

      <p className="mt-6 text-sm text-muted">
        Salvamos seu resultado de forma anônima para melhorar o quiz.
      </p>
    </main>
  );
}
