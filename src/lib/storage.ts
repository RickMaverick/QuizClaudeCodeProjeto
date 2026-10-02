// Todo acesso a storage passa por aqui: em navegação privada ou com storage
// bloqueado, os acessos podem lançar exceção (PRD §6.5).

type Area = "local" | "session";

export const STORAGE_KEYS = {
  state: "quiz:state",
  nickname: "quiz:nickname",
  anonymousId: "quiz:anonymousId",
} as const;

function area(which: Area): Storage | null {
  try {
    return which === "local" ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
}

export function safeGet(which: Area, key: string): string | null {
  try {
    return area(which)?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

export function safeSet(which: Area, key: string, value: string): void {
  try {
    area(which)?.setItem(key, value);
  } catch {
    // ignora: storage indisponível ou cheio
  }
}

export function safeRemove(which: Area, key: string): void {
  try {
    area(which)?.removeItem(key);
  } catch {
    // ignora
  }
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** Identificador anônimo do navegador, gerado no primeiro acesso. */
export function getAnonymousId(): string {
  const stored = safeGet("local", STORAGE_KEYS.anonymousId);
  if (stored && UUID_PATTERN.test(stored)) return stored;
  const id = crypto.randomUUID();
  safeSet("local", STORAGE_KEYS.anonymousId, id);
  return id;
}

export function getStoredNickname(): string {
  return safeGet("local", STORAGE_KEYS.nickname) ?? "";
}

export function setStoredNickname(nickname: string | null): void {
  if (nickname) safeSet("local", STORAGE_KEYS.nickname, nickname);
  else safeRemove("local", STORAGE_KEYS.nickname);
}

export function clearQuizState(): void {
  safeRemove("session", STORAGE_KEYS.state);
}
