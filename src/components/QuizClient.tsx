"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { questionsById } from "@/data/questions";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useQuiz } from "@/hooks/useQuiz";
import { QUESTIONS_PER_LEVEL, levelAt } from "@/lib/quiz/levels";
import { isCurrentAnswered } from "@/lib/quiz/store";
import { AnswerButtons } from "./AnswerButtons";
import { FeedbackPanel } from "./FeedbackPanel";
import { LevelBanner } from "./LevelBanner";
import { ProgressBar } from "./ProgressBar";
import { QuestionCard } from "./QuestionCard";
import { ResultSummary } from "./ResultSummary";

export default function QuizClient() {
  const { state, answer, next, finish, retrySave } = useQuiz();
  // Índice exibido no primeiro render: não roubamos o foco ao abrir a página.
  const [firstIndex] = useState(state.currentIndex);

  const finished = state.status === "finished";
  const answered = isCurrentAnswered(state);
  const isLast = state.currentIndex === state.questionIds.length - 1;
  const advance = isLast ? finish : next;

  useKeyboardShortcuts({
    onTrue: !finished && !answered ? () => answer(true) : undefined,
    onFalse: !finished && !answered ? () => answer(false) : undefined,
    onNext: !finished && answered ? advance : undefined,
  });

  if (finished) {
    return <ResultSummary state={state} onRetrySave={retrySave} />;
  }

  const question = questionsById.get(state.questionIds[state.currentIndex])!;
  const userAnswer = answered ? state.answers[state.currentIndex] : null;
  const startsLevel = state.currentIndex % QUESTIONS_PER_LEVEL === 0;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="sr-only">Partida em andamento</h1>
      <ProgressBar currentIndex={state.currentIndex} answeredCount={state.answers.length} />

      <AnimatePresence mode="wait" initial={false}>
        <motion.section
          key={question.id}
          aria-label={`Pergunta ${state.currentIndex + 1}`}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.25 }}
        >
          {startsLevel && <LevelBanner level={levelAt(state.currentIndex)} />}
          <QuestionCard
            question={question}
            index={state.currentIndex}
            // Se a resposta veio durante a animação de saída, o foco já está no "Próxima".
            autoFocus={state.currentIndex !== firstIndex && !answered}
          >
            <AnswerButtons
              disabled={answered}
              selected={userAnswer?.answer ?? null}
              onAnswer={answer}
            />
          </QuestionCard>
        </motion.section>
      </AnimatePresence>

      <div aria-live="polite">
        {userAnswer && (
          <FeedbackPanel
            key={question.id}
            question={question}
            correct={userAnswer.correct}
            isLast={isLast}
            onNext={advance}
          />
        )}
      </div>
    </div>
  );
}
