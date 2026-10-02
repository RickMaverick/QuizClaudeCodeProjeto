"use client";

import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { questionsById } from "@/data/questions";
import { classify } from "@/lib/quiz/classification";
import { LEVELS, LEVEL_LABELS, QUESTIONS_PER_LEVEL } from "@/lib/quiz/levels";
import { scoreAnswers } from "@/lib/quiz/score";
import { clearQuizState } from "@/lib/storage";
import type { QuizState } from "@/types/quiz";
import { RichText } from "./RichText";

interface ResultSummaryProps {
  state: QuizState;
  onRetrySave: () => void;
}

const saveMessages = {
  idle: "",
  saving: "Salvando resultado…",
  saved: "Resultado salvo.",
  error: "Não foi possível salvar o resultado.",
};

export function ResultSummary({ state, onRetrySave }: ResultSummaryProps) {
  const router = useRouter();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const result = scoreAnswers(state.answers, questionsById);
  const classification = classify(result.score);
  const wrong = result.graded.filter((a) => !a.correct);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  function playAgain() {
    clearQuizState();
    router.push("/");
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-2xl border border-border bg-surface p-6 text-center sm:p-8">
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="font-display text-2xl font-semibold outline-none"
        >
          Resultado{state.nickname ? `, ${state.nickname}` : ""}
        </h1>
        <p className="mt-3 text-5xl font-bold" aria-label={`${result.score} de 15 acertos`}>
          {result.score} <span className="text-2xl font-medium text-muted">de 15</span>
        </p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 14 }}
          className="mt-6 rounded-xl bg-accent-soft px-4 py-5"
        >
          <p className="text-5xl" aria-hidden="true">
            {classification.emoji}
          </p>
          <p className="mt-2 font-display text-2xl font-semibold">{classification.name}</p>
          <p className="mt-1 text-muted">{classification.message}</p>
        </motion.div>

        <ul className="mt-6 grid grid-cols-3 gap-2 text-xs sm:text-sm" aria-label="Acertos por nível">
          {LEVELS.map((level) => (
            <li key={level} className="rounded-lg border border-border px-1 py-3">
              <p className="text-muted">{LEVEL_LABELS[level]}</p>
              <p className="text-lg font-semibold">
                {result.byLevel[level]}/{QUESTIONS_PER_LEVEL}
              </p>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={playAgain}
          className="mt-6 min-h-12 w-full rounded-xl bg-accent px-6 text-lg font-semibold text-accent-fg transition hover:brightness-110"
        >
          Jogar novamente
        </button>

        <p className="mt-4 text-sm text-muted" role="status">
          {saveMessages[state.saveStatus]}
          {state.saveStatus === "error" && (
            <>
              {" "}
              <button type="button" onClick={onRetrySave} className="underline underline-offset-2">
                Tentar de novo
              </button>
            </>
          )}
        </p>
      </section>

      {wrong.length > 0 && (
        <section aria-labelledby="review-heading">
          <h2 id="review-heading" className="font-display text-xl font-semibold">
            Revise o que você errou
          </h2>
          <ul className="mt-3 flex flex-col gap-3">
            {wrong.map(({ questionId }) => {
              const question = questionsById.get(questionId)!;
              return (
                <li key={questionId} className="rounded-xl border border-border bg-surface p-4">
                  <p className="font-medium">
                    <RichText text={question.statement} />
                  </p>
                  <p className="mt-1 text-sm">
                    Resposta correta:{" "}
                    <strong>{question.answer ? "Verdadeiro" : "Falso"}</strong>
                  </p>
                  <a
                    href={question.docUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-sm font-medium text-accent underline underline-offset-4"
                  >
                    Ver na documentação<span className="sr-only"> (abre em nova aba)</span>
                    <span aria-hidden="true"> ↗</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
