import { z } from "zod";
import { questionsById } from "@/data/questions";
import type { QuizState, SaveStatus } from "@/types/quiz";
import { TOTAL_QUESTIONS, levelAt } from "./levels";

export type QuizAction =
  | { type: "START"; questionIds: string[]; nickname: string | null; startedAt: string }
  | { type: "ANSWER"; answer: boolean; answeredAt: string }
  | { type: "NEXT" }
  | { type: "FINISH" }
  | { type: "RESET" }
  | { type: "SAVE_STATUS"; status: SaveStatus };

export const initialQuizState: QuizState = {
  status: "idle",
  questionIds: [],
  currentIndex: 0,
  answers: [],
  nickname: null,
  startedAt: "",
  saveStatus: "idle",
};

/** A pergunta atual já foi respondida (fase de feedback)? */
export function isCurrentAnswered(state: QuizState): boolean {
  return state.answers.length > state.currentIndex;
}

export function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case "START":
      return {
        ...initialQuizState,
        status: "playing",
        questionIds: action.questionIds,
        nickname: action.nickname,
        startedAt: action.startedAt,
      };

    case "ANSWER": {
      if (state.status !== "playing" || isCurrentAnswered(state)) return state;
      const questionId = state.questionIds[state.currentIndex];
      const question = questionsById.get(questionId);
      if (!question) return state;
      return {
        ...state,
        answers: [
          ...state.answers,
          {
            questionId,
            answer: action.answer,
            correct: question.answer === action.answer,
            answeredAt: action.answeredAt,
          },
        ],
      };
    }

    case "NEXT":
      if (
        state.status !== "playing" ||
        !isCurrentAnswered(state) ||
        state.currentIndex >= state.questionIds.length - 1
      ) {
        return state;
      }
      return { ...state, currentIndex: state.currentIndex + 1 };

    case "FINISH":
      if (state.status !== "playing" || state.answers.length !== state.questionIds.length) {
        return state;
      }
      return { ...state, status: "finished" };

    case "RESET":
      return initialQuizState;

    case "SAVE_STATUS":
      return { ...state, saveStatus: action.status };
  }
}

const storedStateSchema = z.object({
  status: z.enum(["playing", "finished"]),
  questionIds: z.array(z.string()).length(TOTAL_QUESTIONS),
  currentIndex: z
    .number()
    .int()
    .min(0)
    .max(TOTAL_QUESTIONS - 1),
  answers: z
    .array(
      z.object({
        questionId: z.string(),
        answer: z.boolean(),
        correct: z.boolean(),
        answeredAt: z.string(),
      }),
    )
    .max(TOTAL_QUESTIONS),
  nickname: z.string().nullable(),
  startedAt: z.string().min(1),
  saveStatus: z.enum(["idle", "saving", "saved", "error"]),
});

/**
 * Restaura a partida salva em sessionStorage. Devolve null se o conteúdo for
 * inválido ou não bater com o banco de perguntas atual.
 */
export function parseStoredState(raw: string | null): QuizState | null {
  if (!raw) return null;
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return null;
  }
  const parsed = storedStateSchema.safeParse(data);
  if (!parsed.success) return null;
  const state = parsed.data;

  const idsOk =
    new Set(state.questionIds).size === TOTAL_QUESTIONS &&
    state.questionIds.every((id, i) => questionsById.get(id)?.level === levelAt(i));
  const answersOk = state.answers.every((a, i) => a.questionId === state.questionIds[i]);
  const progressOk =
    state.status === "finished"
      ? state.answers.length === TOTAL_QUESTIONS
      : state.answers.length === state.currentIndex ||
        state.answers.length === state.currentIndex + 1;
  if (!idsOk || !answersOk || !progressOk) return null;

  // Um salvamento interrompido pelo reload é tratado como falha.
  return state.saveStatus === "saving" ? { ...state, saveStatus: "error" } : state;
}
