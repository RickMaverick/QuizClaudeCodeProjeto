import type { Level } from "@/types/quiz";

/** Ordem dos níveis dentro de uma partida. */
export const LEVELS: readonly Level[] = ["beginner", "intermediate", "advanced"];

export const QUESTIONS_PER_LEVEL = 5;
export const TOTAL_QUESTIONS = LEVELS.length * QUESTIONS_PER_LEVEL;

export const LEVEL_LABELS: Record<Level, string> = {
  beginner: "Iniciante",
  intermediate: "Intermediário",
  advanced: "Avançado",
};

/** Nível esperado para a pergunta na posição `index` (0-based) da partida. */
export function levelAt(index: number): Level {
  return LEVELS[Math.min(Math.floor(index / QUESTIONS_PER_LEVEL), LEVELS.length - 1)];
}
