import type { ClassificationKey } from "@/types/quiz";

export interface Classification {
  key: ClassificationKey;
  min: number;
  max: number;
  emoji: string;
  name: string;
  message: string;
}

/** Faixas de classificação final (PRD §5.3). Fonte única para cliente e servidor. */
export const CLASSIFICATIONS: readonly Classification[] = [
  {
    key: "explorador",
    min: 0,
    max: 5,
    emoji: "🌱",
    name: "Explorador",
    message: "Você está começando a jornada. Explore os links da documentação e tente de novo!",
  },
  {
    key: "praticante",
    min: 6,
    max: 9,
    emoji: "🛠️",
    name: "Praticante",
    message: "Você já domina o básico. Hora de aprofundar em customização.",
  },
  {
    key: "especialista",
    min: 10,
    max: 12,
    emoji: "🚀",
    name: "Especialista",
    message: "Você manda bem! Falta pouco para dominar as integrações avançadas.",
  },
  {
    key: "power_user",
    min: 13,
    max: 15,
    emoji: "🧠",
    name: "Power User",
    message: "Impressionante! Você conhece o Claude Code de ponta a ponta.",
  },
];

export const CLASSIFICATION_KEYS = CLASSIFICATIONS.map((c) => c.key) as [
  ClassificationKey,
  ...ClassificationKey[],
];

export function classify(score: number): Classification {
  const found = CLASSIFICATIONS.find((c) => score >= c.min && score <= c.max);
  if (!found) throw new RangeError(`Pontuação fora do intervalo: ${score}`);
  return found;
}
