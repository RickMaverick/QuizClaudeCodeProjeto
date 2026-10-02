import { z } from "zod";
import type { Question } from "@/types/quiz";
import { LEVELS, TOTAL_QUESTIONS, levelAt } from "@/lib/quiz/levels";

export const STATEMENT_MAX = 160;
export const EXPLANATION_MAX = 300;
export const NICKNAME_MAX = 30;
export const NICKNAME_PATTERN = /^[\p{L}\p{N} _.-]+$/u;
const MAX_SESSION_AGE_MS = 24 * 60 * 60 * 1000;
const CLOCK_SKEW_MS = 5 * 60 * 1000;

export const questionSchema = z.object({
  id: z.string().regex(/^(beg|int|adv)-\d{2}$/),
  level: z.enum(LEVELS as [Question["level"], ...Question["level"][]]),
  topic: z.string().min(1),
  statement: z.string().min(1).max(STATEMENT_MAX),
  answer: z.boolean(),
  explanation: z.string().min(1).max(EXPLANATION_MAX),
  docUrl: z.url().startsWith("https://code.claude.com/"),
  active: z.boolean(),
  verifiedAt: z.union([z.literal(""), z.iso.date()]),
});

export const questionBankSchema = z.array(questionSchema);

/** Apelido opcional (PRD §5.4): trim; vazio vira null; 1–30 caracteres permitidos. */
export const nicknameSchema = z
  .union([z.string(), z.null(), z.undefined()])
  .transform((value) => value?.trim() || null)
  .pipe(z.string().max(NICKNAME_MAX).regex(NICKNAME_PATTERN).nullable());

export const answerInputSchema = z.object({
  questionId: z.string().min(1).max(20),
  answer: z.boolean(),
});

/** Payload de POST /api/sessions (PRD §8). */
export function createSessionPayloadSchema(
  questionsById: ReadonlyMap<string, Question>,
  now: () => number = Date.now,
) {
  return z
    .object({
      anonymousId: z.uuid(),
      nickname: nicknameSchema,
      startedAt: z.iso.datetime({ offset: true }),
      answers: z.array(answerInputSchema).length(TOTAL_QUESTIONS),
    })
    .superRefine((payload, ctx) => {
      const started = Date.parse(payload.startedAt);
      const current = now();
      if (started > current + CLOCK_SKEW_MS || current - started > MAX_SESSION_AGE_MS) {
        ctx.addIssue({ code: "custom", path: ["startedAt"], message: "startedAt fora da janela" });
      }

      const seen = new Set<string>();
      payload.answers.forEach(({ questionId }, index) => {
        const question = questionsById.get(questionId);
        if (!question) {
          ctx.addIssue({ code: "custom", path: ["answers", index], message: "pergunta inexistente" });
        } else if (question.level !== levelAt(index)) {
          ctx.addIssue({ code: "custom", path: ["answers", index], message: "nível fora de ordem" });
        }
        if (seen.has(questionId)) {
          ctx.addIssue({ code: "custom", path: ["answers", index], message: "pergunta repetida" });
        }
        seen.add(questionId);
      });
    });
}

export type SessionPayload = z.infer<ReturnType<typeof createSessionPayloadSchema>>;
