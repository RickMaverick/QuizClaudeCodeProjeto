"use client";

import { useEffect, useRef } from "react";
import type { Question } from "@/types/quiz";
import { RichText } from "./RichText";

interface QuestionCardProps {
  question: Question;
  index: number;
  /** Move o foco para a afirmação ao montar (troca de pergunta). */
  autoFocus: boolean;
  children: React.ReactNode;
}

export function QuestionCard({ question, index, autoFocus, children }: QuestionCardProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (autoFocus) headingRef.current?.focus({ preventScroll: false });
  }, [autoFocus]);

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-7">
      <p className="text-sm text-muted">Afirmação {index + 1}</p>
      <h2
        ref={headingRef}
        tabIndex={-1}
        className="mt-2 font-display text-xl leading-snug font-medium outline-none sm:text-2xl"
      >
        <RichText text={question.statement} />
      </h2>
      <div className="mt-6">{children}</div>
    </div>
  );
}
