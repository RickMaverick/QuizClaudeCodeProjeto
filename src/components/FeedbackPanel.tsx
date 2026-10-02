"use client";

import { motion } from "motion/react";
import { useEffect, useRef } from "react";
import type { Question } from "@/types/quiz";
import { RichText } from "./RichText";

interface FeedbackPanelProps {
  question: Question;
  correct: boolean;
  isLast: boolean;
  onNext: () => void;
}

export function FeedbackPanel({ question, correct, isLast, onNext }: FeedbackPanelProps) {
  const nextRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    nextRef.current?.focus();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={
        correct
          ? { opacity: 1, y: 0, scale: [0.96, 1.02, 1] }
          : { opacity: 1, y: 0, x: [0, -8, 8, -5, 5, 0] }
      }
      transition={{ duration: 0.45 }}
      className={`mt-4 rounded-2xl border-2 p-5 sm:p-6 ${
        correct ? "border-success bg-success-soft" : "border-error bg-error-soft"
      }`}
    >
      <p
        className={`flex items-center gap-2 text-xl font-bold ${
          correct ? "text-success" : "text-error"
        }`}
      >
        <span aria-hidden="true">{correct ? "✓" : "✗"}</span>
        {correct ? "Acertou!" : "Errou!"}
      </p>
      <p className="mt-2 font-medium">
        A resposta correta é: {question.answer ? "Verdadeiro" : "Falso"}
      </p>
      <p className="mt-2">
        <RichText text={question.explanation} />
      </p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <a
          href={question.docUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-accent underline underline-offset-4 hover:no-underline"
        >
          Saiba mais na documentação
          <span className="sr-only"> (abre em nova aba)</span>
          <span aria-hidden="true"> ↗</span>
        </a>
        <button
          ref={nextRef}
          type="button"
          onClick={onNext}
          className="min-h-12 rounded-xl bg-accent px-6 font-semibold text-accent-fg transition hover:brightness-110"
        >
          {isLast ? "Ver resultado" : "Próxima"}
        </button>
      </div>
    </motion.div>
  );
}
