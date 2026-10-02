"use client";

import { useCallback, useEffect, useReducer } from "react";
import { questions } from "@/data/questions";
import { saveSession } from "@/lib/api";
import { drawQuestionIds } from "@/lib/quiz/draw";
import { initialQuizState, parseStoredState, quizReducer } from "@/lib/quiz/store";
import { nicknameSchema } from "@/lib/schemas";
import {
  STORAGE_KEYS,
  getAnonymousId,
  getStoredNickname,
  safeGet,
  safeSet,
} from "@/lib/storage";
import type { QuizState } from "@/types/quiz";

/** Restaura a partida do sessionStorage ou começa uma nova. Só roda no navegador. */
function initQuiz(): QuizState {
  const restored = parseStoredState(safeGet("session", STORAGE_KEYS.state));
  if (restored) return restored;
  return quizReducer(initialQuizState, {
    type: "START",
    questionIds: drawQuestionIds(questions),
    nickname: nicknameSchema.safeParse(getStoredNickname()).data ?? null,
    startedAt: new Date().toISOString(),
  });
}

export function useQuiz() {
  const [state, dispatch] = useReducer(quizReducer, undefined, initQuiz);

  useEffect(() => {
    safeSet("session", STORAGE_KEYS.state, JSON.stringify(state));
  }, [state]);

  const answer = useCallback(
    (value: boolean) =>
      dispatch({ type: "ANSWER", answer: value, answeredAt: new Date().toISOString() }),
    [],
  );

  const next = useCallback(() => dispatch({ type: "NEXT" }), []);

  const save = useCallback(async (finished: QuizState) => {
    dispatch({ type: "SAVE_STATUS", status: "saving" });
    const result = await saveSession({
      anonymousId: getAnonymousId(),
      nickname: finished.nickname,
      startedAt: finished.startedAt,
      answers: finished.answers.map(({ questionId, answer }) => ({ questionId, answer })),
    });
    dispatch({ type: "SAVE_STATUS", status: result ? "saved" : "error" });
  }, []);

  const finish = useCallback(() => {
    dispatch({ type: "FINISH" });
    if (state.answers.length === state.questionIds.length && state.saveStatus === "idle") {
      void save(state);
    }
  }, [save, state]);

  const retrySave = useCallback(() => void save(state), [save, state]);

  return { state, answer, next, finish, retrySave };
}
