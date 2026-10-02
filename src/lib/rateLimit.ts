/**
 * Rate limit em memória por janela deslizante. Suficiente para o MVP (PRD §8):
 * cada instância serverless tem sua própria contagem.
 */
export function createRateLimiter({
  limit,
  windowMs,
  now = Date.now,
}: {
  limit: number;
  windowMs: number;
  now?: () => number;
}) {
  const hits = new Map<string, number[]>();

  return {
    /** Registra uma requisição; devolve false se o limite foi excedido. */
    take(key: string): boolean {
      const current = now();
      const recent = (hits.get(key) ?? []).filter((t) => current - t < windowMs);
      if (recent.length >= limit) {
        hits.set(key, recent);
        return false;
      }
      recent.push(current);
      hits.set(key, recent);
      // Limpeza oportunista para o Map não crescer indefinidamente.
      if (hits.size > 10_000) {
        for (const [k, times] of hits) {
          if (times.every((t) => current - t >= windowMs)) hits.delete(k);
        }
      }
      return true;
    },
  };
}
