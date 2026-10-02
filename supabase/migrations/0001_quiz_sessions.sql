create table if not exists public.quiz_sessions (
  id              uuid primary key default gen_random_uuid(),
  anonymous_id    uuid not null,
  nickname        text check (nickname is null or char_length(nickname) between 1 and 30),
  score           smallint not null check (score between 0 and 15),
  total           smallint not null default 15,
  score_beginner      smallint not null check (score_beginner between 0 and 5),
  score_intermediate  smallint not null check (score_intermediate between 0 and 5),
  score_advanced      smallint not null check (score_advanced between 0 and 5),
  classification  text not null check (classification in ('explorador','praticante','especialista','power_user')),
  answers         jsonb not null,          -- [{questionId, answer, correct}]
  question_set_version text not null,      -- versão do banco de perguntas (hash)
  started_at      timestamptz not null,
  finished_at     timestamptz not null default now(),
  duration_ms     integer generated always as
                    ((extract(epoch from (finished_at - started_at)) * 1000)::integer) stored,
  user_agent      text,
  created_at      timestamptz not null default now()
);

create index if not exists quiz_sessions_created_at_idx on public.quiz_sessions (created_at desc);
create index if not exists quiz_sessions_anonymous_id_idx on public.quiz_sessions (anonymous_id);

alter table public.quiz_sessions enable row level security;
-- Nenhuma policy para anon/authenticated: todo acesso passa pela API do Next.js
-- usando a service role key (somente no servidor).
