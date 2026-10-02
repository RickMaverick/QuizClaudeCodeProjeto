export type Level = "beginner" | "intermediate" | "advanced";

export interface Question {
  id: string; // ex.: 'beg-01'
  level: Level;
  topic: string; // ex.: 'memory', 'hooks', 'mcp'
  statement: string; // afirmação
  answer: boolean; // true = Verdadeiro
  explanation: string;
  docUrl: string; // URL absoluta da doc oficial
  active: boolean;
  verifiedAt: string; // ISO date da última validação contra a doc
}

export interface UserAnswer {
  questionId: string;
  answer: boolean;
  correct: boolean;
  answeredAt: string;
}

export type SaveStatus = "idle" | "saving" | "saved" | "error";

export interface QuizState {
  status: "idle" | "playing" | "finished";
  questionIds: string[]; // 15 ids na ordem da partida
  currentIndex: number;
  answers: UserAnswer[];
  nickname: string | null;
  startedAt: string;
  saveStatus: SaveStatus;
}

export type ClassificationKey = "explorador" | "praticante" | "especialista" | "power_user";
