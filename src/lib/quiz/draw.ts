import type { Question } from "@/types/quiz";
import { LEVELS, QUESTIONS_PER_LEVEL } from "./levels";

export type Rng = () => number;

/** Fisher–Yates: devolve uma cópia embaralhada. */
export function shuffle<T>(items: readonly T[], rng: Rng = Math.random): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Sorteia 5 perguntas ativas por nível e devolve os ids na ordem da partida
 * (iniciante → intermediário → avançado, ordem aleatória dentro de cada nível).
 */
export function drawQuestionIds(questions: readonly Question[], rng: Rng = Math.random): string[] {
  return LEVELS.flatMap((level) => {
    const pool = questions.filter((q) => q.active && q.level === level);
    if (pool.length < QUESTIONS_PER_LEVEL) {
      throw new Error(`Nível "${level}" tem só ${pool.length} perguntas ativas.`);
    }
    return shuffle(pool, rng)
      .slice(0, QUESTIONS_PER_LEVEL)
      .map((q) => q.id);
  });
}
