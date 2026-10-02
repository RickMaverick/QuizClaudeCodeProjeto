"use client";

import { motion } from "motion/react";
import { LEVELS, LEVEL_LABELS, QUESTIONS_PER_LEVEL, TOTAL_QUESTIONS, levelAt } from "@/lib/quiz/levels";

interface ProgressBarProps {
  currentIndex: number;
  answeredCount: number;
}

export function ProgressBar({ currentIndex, answeredCount }: ProgressBarProps) {
  const level = levelAt(currentIndex);
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4 text-sm">
        <p className="font-semibold text-accent">Nível {LEVEL_LABELS[level]}</p>
        <p className="text-muted">
          Pergunta {currentIndex + 1} de {TOTAL_QUESTIONS}
        </p>
      </div>
      <div
        role="progressbar"
        aria-label="Progresso da partida"
        aria-valuemin={0}
        aria-valuemax={TOTAL_QUESTIONS}
        aria-valuenow={answeredCount}
        aria-valuetext={`${answeredCount} de ${TOTAL_QUESTIONS} respondidas, nível ${LEVEL_LABELS[level]}`}
        className="mt-2 flex gap-2"
      >
        {LEVELS.map((lvl, group) => (
          <div key={lvl} className="flex flex-1 gap-1">
            {Array.from({ length: QUESTIONS_PER_LEVEL }, (_, i) => {
              const index = group * QUESTIONS_PER_LEVEL + i;
              const filled = index < answeredCount;
              const current = index === currentIndex;
              return (
                <div
                  key={index}
                  className={`relative h-2 flex-1 overflow-hidden rounded-full bg-track ${
                    current ? "ring-2 ring-accent ring-offset-1 ring-offset-bg" : ""
                  }`}
                >
                  <motion.div
                    className="absolute inset-0 origin-left rounded-full bg-accent"
                    initial={false}
                    animate={{ scaleX: filled ? 1 : 0 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
