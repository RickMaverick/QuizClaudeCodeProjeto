# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project status

`prd.md` (pt-BR) is the product spec and source of truth; read the relevant section before changing behavior. The MVP is implemented except for the Supabase/Vercel setup.

**No automated tests in this MVP** — the user tests manually. Don't add test files or test tooling; verify changes with lint, typecheck and build.

The product is a pt-BR True/False web quiz about Claude Code. Each game has 15 questions in fixed difficulty order (5 beginner → 5 intermediate → 5 advanced), drawn from a bank of 45. After each answer the player gets immediate feedback with an explanation and a doc link. The game ends with a final classification. All user-facing text is **Portuguese (pt-BR)**, and `<html lang="pt-BR">`.

## Stack and commands

Next.js 16 (App Router, Turbopack, `src/` dir), React 19, TypeScript `strict`, Tailwind v4 (tokens in `src/app/globals.css`), `motion` (Framer Motion, imported from `motion/react`), Zod 4, `@supabase/supabase-js`, ESLint 9 flat config + Prettier, npm, deployment on Vercel.

```bash
npm run dev          # local dev server
npm run lint
npm run typecheck    # next typegen && tsc --noEmit (typegen creates LayoutProps/PageProps)
npm run build        # also validates the question bank (see below)
npm run format
```

The env vars (`.env.example`) are `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.

## Architecture (key decisions that span multiple files)

- **The question bank lives in the repo, not the database.** It's `src/data/questions.ts`, a typed array of `Question` (see the PRD §6.4 types), and content changes go through PRs. The client receives the full questions, answers and explanations included, which is intentional because this is a learning quiz. Supabase stores **only game results** (the `quiz_sessions` table, migration in `supabase/migrations/`).
- **The server recalculates the score.** `POST /api/sessions` (`src/app/api/sessions/route.ts`) receives only `anonymousId`, `nickname`, `startedAt` and `answers[{questionId, answer}]`. It re-derives `correct`, total and per-level scores, and the classification from `questions.ts`, so the quiz logic in `src/lib/quiz/` must stay importable on both client and server. The Zod validation rules are in §8 of `prd.md`: exactly 15 unique answers, 5 per level in order, `startedAt` within 24h, nickname rules, and a rate limit of 20/h per anonymousId+IP.
- **Supabase is accessed only from the server.** RLS is on with no public policies. The service-role client lives in `src/lib/supabase/server.ts` with `import 'server-only'`. Never use a `NEXT_PUBLIC_` Supabase key, and never let the browser talk to Supabase directly.
- **Client state** uses `useReducer` (`START`/`ANSWER`/`NEXT`/`FINISH`/`RESET`) with no external state library. An in-progress game is saved in `sessionStorage` under `quiz:state`, so a reload restores it. `quiz:nickname` and `quiz:anonymousId` (from `crypto.randomUUID()`) go in `localStorage`. Wrap every storage access in try/catch. If saving the result fails, the result screen still shows; retry once.
- **The draw** (`src/lib/quiz/draw.ts`) runs a Fisher–Yates shuffle per level over `active` questions only. **Classification bands** (0–5 Explorador, 6–9 Praticante, 10–12 Especialista, 13–15 Power User) and their texts live in one module, `classification.ts`. Their DB values are `explorador | praticante | especialista | power_user`.
- **Question-bank validation runs at build time.** `assertValidQuestionBank()` (`src/lib/quiz/validateBank.ts`) is called by the statically prerendered Home, so `next build` fails if any level has fewer than 5 active questions, ids repeat, a `docUrl` doesn't start with `https://code.claude.com/`, text exceeds the limits in `src/lib/schemas.ts` (statement 160, explanation 300), or a level has more than 2/3 of one answer.
- **`/quiz` renders client-only** (`QuizLoader` → `next/dynamic` with `ssr: false`) because the game state is read from storage in the reducer's lazy initializer (`src/hooks/useQuiz.ts`). The page itself stays static.

## Content and UI constraints

- New or edited questions must be checked against the current official docs, with `verifiedAt` updated. Doc paths in the PRD are relative to `https://code.claude.com/docs/en`. Check that each URL resolves.
- Accessibility targets WCAG 2.1 AA. The quiz must be fully playable by keyboard (`V`/`←` = Verdadeiro, `F`/`→` = Falso, `Enter` = next question). Feedback is announced with `aria-live="polite"` and is never conveyed by color alone. Contrast is ≥ 4.5:1, and the V/F buttons are touch targets of at least 48px.
- Design is mobile-first: the question card is at most ~640px wide, with no horizontal scroll at 375px. Light and dark themes follow `prefers-color-scheme`. Animations must respect `prefers-reduced-motion`. Don't use Anthropic logos or trademarks.
- The PRD §2.2 out-of-scope items (auth, leaderboard, timers, sharing, admin) are not part of the MVP. Don't build them.
