"use client";

import { motion } from "motion/react";
import { LEVEL_LABELS } from "@/lib/quiz/levels";
import type { Level } from "@/types/quiz";

const topics: Record<Level, string> = {
  beginner: "Uso no dia a dia: comandos, CLAUDE.md, permissões e atalhos.",
  intermediate: "Customização: skills, subagents, hooks, settings e plugins.",
  advanced: "Integrações: MCP, headless, CI, worktrees, SDK e segurança.",
};

export function LevelBanner({ level }: { level: Level }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-4 rounded-xl border border-accent/40 bg-accent-soft px-4 py-3"
    >
      <p className="font-display text-lg font-semibold">Nível {LEVEL_LABELS[level]}</p>
      <p className="text-sm text-muted">{topics[level]}</p>
    </motion.div>
  );
}
