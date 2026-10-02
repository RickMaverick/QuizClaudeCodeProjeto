import type { Metadata } from "next";
import Link from "next/link";
import { QuizLoader } from "@/components/QuizLoader";

export const metadata: Metadata = {
  title: "Partida — Quiz Claude Code",
};

export default function QuizPage() {
  return (
    <main className="mx-auto flex w-full max-w-160 flex-1 flex-col px-4 py-6 sm:py-10">
      <header className="mb-6">
        {/* O h1 da página fica no conteúdo da partida/resultado. */}
        <Link href="/" className="font-display text-lg font-semibold">
          Quiz Claude Code
        </Link>
      </header>
      <QuizLoader />
    </main>
  );
}
