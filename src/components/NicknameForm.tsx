"use client";

import { useRouter } from "next/navigation";
import { useId, useState, useSyncExternalStore } from "react";
import { NICKNAME_MAX, nicknameSchema } from "@/lib/schemas";
import { clearQuizState, getStoredNickname, setStoredNickname } from "@/lib/storage";

const noopSubscribe = () => () => {};

export function NicknameForm() {
  const router = useRouter();
  const inputId = useId();
  const errorId = useId();
  // Apelido salvo da última partida (só existe no navegador).
  const storedNickname = useSyncExternalStore(noopSubscribe, getStoredNickname, () => "");
  const [draft, setDraft] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const value = draft ?? storedNickname;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = nicknameSchema.safeParse(value);
    if (!parsed.success) {
      setError("Use até 30 caracteres: letras, números, espaço, _ - ou .");
      return;
    }
    setStoredNickname(parsed.data);
    clearQuizState();
    router.push("/quiz");
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3" noValidate>
      <label htmlFor={inputId} className="font-medium">
        Apelido <span className="font-normal text-muted">(opcional)</span>
      </label>
      <input
        id={inputId}
        name="nickname"
        type="text"
        autoComplete="nickname"
        maxLength={NICKNAME_MAX}
        value={value}
        onChange={(event) => {
          setDraft(event.target.value);
          setError(null);
        }}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className="min-h-12 rounded-xl border border-border bg-surface px-4 text-base"
        placeholder="Como quer ser chamado?"
      />
      {error && (
        <p id={errorId} className="text-sm text-error" role="alert">
          {error}
        </p>
      )}
      <button
        type="submit"
        className="mt-2 min-h-12 rounded-xl bg-accent px-6 text-lg font-semibold text-accent-fg transition hover:brightness-110 active:scale-[0.99]"
      >
        Começar
      </button>
    </form>
  );
}
