"use client";

import { useEffect } from "react";

interface Shortcuts {
  onTrue?: () => void;
  onFalse?: () => void;
  onNext?: () => void;
}

/**
 * Atalhos do quiz: V/← = Verdadeiro, F/→ = Falso, Enter = próxima.
 * Ignora teclas com modificadores e eventos vindos de campos de texto; Enter em
 * botões e links fica com o comportamento nativo (evita avançar duas vezes).
 */
export function useKeyboardShortcuts({ onTrue, onFalse, onNext }: Shortcuts) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable='true']")) return;

      const key = event.key.toLowerCase();
      if ((key === "v" || key === "arrowleft") && onTrue) {
        event.preventDefault();
        onTrue();
      } else if ((key === "f" || key === "arrowright") && onFalse) {
        event.preventDefault();
        onFalse();
      } else if (key === "enter" && onNext && !target?.closest("button, a")) {
        event.preventDefault();
        onNext();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onTrue, onFalse, onNext]);
}
