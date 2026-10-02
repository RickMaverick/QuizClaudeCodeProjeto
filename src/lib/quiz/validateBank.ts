import { questions } from "@/data/questions";
import { questionBankSchema } from "@/lib/schemas";
import { LEVELS, QUESTIONS_PER_LEVEL } from "./levels";

/**
 * Valida o banco de perguntas (PRD §3.2 e §5.1). Chamado ao pré-renderizar a Home,
 * então um banco inválido quebra o `next build` em vez de falhar em produção.
 */
export function assertValidQuestionBank(): void {
  const problems: string[] = [];

  const parsed = questionBankSchema.safeParse(questions);
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      const id = questions[issue.path[0] as number]?.id ?? "?";
      problems.push(`${id}: ${issue.path.slice(1).join(".")} — ${issue.message}`);
    }
  }

  const ids = questions.map((q) => q.id);
  const duplicated = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (duplicated.length) problems.push(`ids repetidos: ${duplicated.join(", ")}`);

  for (const level of LEVELS) {
    const active = questions.filter((q) => q.active && q.level === level);
    if (active.length < QUESTIONS_PER_LEVEL) {
      problems.push(`nível ${level}: só ${active.length} perguntas ativas`);
    }
    const trues = active.filter((q) => q.answer).length;
    const limit = (active.length * 2) / 3;
    if (trues > limit || active.length - trues > limit) {
      problems.push(`nível ${level}: desequilíbrio V/F (${trues} V de ${active.length})`);
    }
  }

  if (problems.length) {
    throw new Error(`Banco de perguntas inválido:\n- ${problems.join("\n- ")}`);
  }
}
