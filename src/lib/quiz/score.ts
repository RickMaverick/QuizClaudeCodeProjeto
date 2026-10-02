import type { ClassificationKey, Level, Question } from "@/types/quiz";
import { classify } from "./classification";

export interface AnswerInput {
  questionId: string;
  answer: boolean;
}

export interface GradedAnswer extends AnswerInput {
  correct: boolean;
}

export interface ScoreResult {
  score: number;
  total: number;
  byLevel: Record<Level, number>;
  classification: ClassificationKey;
  graded: GradedAnswer[];
}

/**
 * Corrige as respostas a partir do banco de perguntas. Usado no cliente (tela de
 * resultado) e no servidor (que não confia no placar enviado pelo cliente).
 */
export function scoreAnswers(
  answers: readonly AnswerInput[],
  questionsById: ReadonlyMap<string, Question>,
): ScoreResult {
  const byLevel: Record<Level, number> = { beginner: 0, intermediate: 0, advanced: 0 };
  const graded = answers.map(({ questionId, answer }) => {
    const question = questionsById.get(questionId);
    if (!question) throw new Error(`Pergunta desconhecida: ${questionId}`);
    const correct = question.answer === answer;
    if (correct) byLevel[question.level]++;
    return { questionId, answer, correct };
  });
  const score = graded.filter((a) => a.correct).length;
  return {
    score,
    total: answers.length,
    byLevel,
    classification: classify(score).key,
    graded,
  };
}
