export interface SessionRequest {
  anonymousId: string;
  nickname: string | null;
  startedAt: string;
  answers: { questionId: string; answer: boolean }[];
}

export interface SessionResponse {
  id: string;
  score: number;
  classification: string;
}

async function post(payload: SessionRequest): Promise<Response | null> {
  try {
    return await fetch("/api/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    return null; // erro de rede
  }
}

/**
 * Envia o resultado da partida. Tenta novamente uma vez em erro de rede ou 5xx
 * (PRD §5.5). Nunca lança: a tela de resultado não depende do salvamento.
 */
export async function saveSession(payload: SessionRequest): Promise<SessionResponse | null> {
  for (let attempt = 0; attempt < 2; attempt++) {
    const response = await post(payload);
    if (response?.ok) return (await response.json()) as SessionResponse;
    if (response && response.status < 500) return null;
  }
  return null;
}
