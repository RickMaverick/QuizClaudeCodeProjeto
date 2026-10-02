"use client";

import dynamic from "next/dynamic";

// A partida depende de sessionStorage/localStorage, então só renderiza no navegador.
// A página continua estática: o servidor entrega apenas este esqueleto.
const QuizClient = dynamic(() => import("./QuizClient"), {
  ssr: false,
  loading: () => (
    <p className="py-20 text-center text-muted" role="status">
      Carregando quiz…
    </p>
  ),
});

export function QuizLoader() {
  return <QuizClient />;
}
