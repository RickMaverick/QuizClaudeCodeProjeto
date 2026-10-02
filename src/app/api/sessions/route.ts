import { questionsById } from "@/data/questions";
import { createRateLimiter } from "@/lib/rateLimit";
import { scoreAnswers } from "@/lib/quiz/score";
import { QUESTION_SET_VERSION } from "@/lib/quiz/version";
import { createSessionPayloadSchema } from "@/lib/schemas";
import { getSupabaseAdmin } from "@/lib/supabase/server";

const payloadSchema = createSessionPayloadSchema(questionsById);
const rateLimiter = createRateLimiter({ limit: 20, windowMs: 60 * 60 * 1000 });

function clientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

/** Salva o resultado de uma partida. O placar é recalculado aqui (PRD §5.5). */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Payload inválido." }, { status: 400 });
  }

  const parsed = payloadSchema.safeParse(body);
  if (!parsed.success) {
    console.error("[api/sessions] payload inválido", parsed.error.issues);
    return Response.json({ error: "Payload inválido." }, { status: 400 });
  }
  const payload = parsed.data;

  if (!rateLimiter.take(`${payload.anonymousId}:${clientIp(request)}`)) {
    return Response.json({ error: "Muitas requisições." }, { status: 429 });
  }

  const result = scoreAnswers(payload.answers, questionsById);

  try {
    const { data, error } = await getSupabaseAdmin()
      .from("quiz_sessions")
      .insert({
        anonymous_id: payload.anonymousId,
        nickname: payload.nickname,
        score: result.score,
        total: result.total,
        score_beginner: result.byLevel.beginner,
        score_intermediate: result.byLevel.intermediate,
        score_advanced: result.byLevel.advanced,
        classification: result.classification,
        answers: result.graded,
        question_set_version: QUESTION_SET_VERSION,
        started_at: payload.startedAt,
        user_agent: request.headers.get("user-agent")?.slice(0, 500) ?? null,
      })
      .select("id")
      .single();
    if (error) throw error;

    return Response.json(
      { id: data.id, score: result.score, classification: result.classification },
      { status: 201 },
    );
  } catch (error) {
    console.error("[api/sessions] erro ao salvar", error);
    return Response.json({ error: "Erro ao salvar." }, { status: 500 });
  }
}
