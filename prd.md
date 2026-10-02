# PRD — Quiz Claude Code (Verdadeiro ou Falso)

> Documento de requisitos de produto para ser consumido pelo Claude Code na construção do projeto.
> Versão: 1.0 · Data: 2026-10-01 · Idioma do produto: Português (pt-BR)

---

## 1. Visão geral

### 1.1 Problema
Muita gente quer aprender Claude Code (e IA aplicada à programação) mas não sabe por onde começar nem o quanto já sabe. A documentação é extensa e pouco "gamificada".

### 1.2 Solução
Um quiz web de **Verdadeiro ou Falso** sobre Claude Code, com **15 perguntas por partida** em **progressão contínua de dificuldade** (5 iniciante → 5 intermediário → 5 avançado). Após cada resposta, o usuário vê na hora se acertou, uma **explicação curta** e um **link para a documentação oficial**. Ao final, recebe uma **classificação** de acordo com o desempenho.

### 1.3 Objetivo principal
**Aprendizado.** O quiz é uma ferramenta de ensino: cada pergunta deve ensinar algo, acertando ou errando.

### 1.4 Público-alvo
Pessoas interessadas em aprender sobre IA, Claude Code e programação — desde quem nunca usou o Claude Code até usuários avançados.

### 1.5 Métricas de sucesso
| Métrica | Meta inicial |
|---|---|
| Taxa de conclusão (partidas iniciadas → finalizadas) | ≥ 70% |
| Partidas jogadas novamente pelo mesmo navegador | ≥ 25% |
| Cliques em "Saiba mais" (link da doc) por partida | ≥ 1 em média |
| Tempo médio de partida | 5–8 min |

Métricas derivadas da tabela `quiz_sessions` no Supabase (ver §7).

---

## 2. Escopo

### 2.1 Dentro do escopo (MVP)
- Tela inicial com explicação do quiz e campo de **apelido opcional**.
- Partida com 15 perguntas V/F sorteadas de um banco de 45 (15 por nível).
- Progressão contínua: perguntas 1–5 iniciante, 6–10 intermediário, 11–15 avançado.
- Feedback imediato após cada resposta (certo/errado, explicação, link da doc).
- Tela de resultado com acertos, desempenho por nível e **classificação final**.
- Persistência anônima dos resultados no **Supabase**.
- Responsivo (mobile first), acessível, tema claro/escuro, animações com Framer Motion.
- Deploy na **Vercel**.

### 2.2 Fora do escopo (MVP)
- Login / contas de usuário (Supabase Auth).
- Ranking / leaderboard público.
- Timer por pergunta, pontuação ponderada, streaks.
- Botões de compartilhamento em redes sociais.
- Painel administrativo no app.
- Estatísticas por pergunta exibidas ao usuário.
- Múltiplos idiomas.

> Os itens acima são candidatos a versões futuras (ver §12). A modelagem de dados não deve impedir sua implementação posterior.

---

## 3. Conteúdo do quiz

### 3.1 Níveis e temas
| Nível | Posição na partida | Tema |
|---|---|---|
| Iniciante | 1–5 | **Uso no dia a dia**: comandos básicos, CLAUDE.md, modos de permissão, Plan Mode, atalhos, sessões |
| Intermediário | 6–10 | **Customização**: skills, subagents, hooks, settings.json, permissões, slash commands, plugins, output styles |
| Avançado | 11–15 | **Avançado / integrações**: MCP, modo headless e CI, GitHub Actions, worktrees, Agent SDK, segurança, provedores de nuvem |

> Decisão: o quiz **não** cobre temas de negócio/planos/preços.

### 3.2 Regras de redação das perguntas
- Afirmações curtas e inequívocas (máx. ~160 caracteres), que sejam claramente V ou F.
- Evitar pegadinhas de palavras ("nunca", "sempre") usadas só para enganar; quando usadas, devem ser o ponto da pergunta.
- Explicação de 1–3 frases (máx. ~300 caracteres), que ensine o conceito correto.
- Cada pergunta tem um link para a página da documentação oficial (`https://code.claude.com/docs/...`).
- Equilíbrio aproximado entre V e F em cada nível (nenhum nível com mais de 2/3 de uma só resposta).
- **Antes do release, cada pergunta deve ser validada contra a documentação oficial atual** (o Claude Code evolui rápido). Registrar a data em `verifiedAt`.

### 3.3 Banco inicial de perguntas (45)

Formato: **[resposta]** afirmação — *explicação* — doc.

#### Iniciante (dia a dia)
| ID | Afirmação | Resp. | Explicação | Doc |
|---|---|---|---|---|
| beg-01 | O arquivo CLAUDE.md na raiz do projeto é carregado automaticamente como contexto ao iniciar uma sessão. | V | O CLAUDE.md funciona como "memória" do projeto: convenções, comandos e instruções que o Claude lê no início da sessão. | /memory |
| beg-02 | O comando `/init` analisa o projeto e gera um CLAUDE.md inicial. | V | O `/init` examina o código e cria um CLAUDE.md com a estrutura, comandos de build/teste e convenções detectadas. | /memory |
| beg-03 | O comando `/clear` apaga os arquivos modificados durante a sessão. | F | O `/clear` limpa apenas o histórico da conversa (contexto). Os arquivos no disco não são alterados. | /slash-commands |
| beg-04 | Por padrão, o Claude Code pede permissão antes de editar arquivos ou executar comandos no terminal. | V | O modo padrão solicita aprovação para ações com efeito; isso pode ser ajustado nos modos e regras de permissão. | /iam |
| beg-05 | Para iniciar uma sessão interativa, basta digitar `claude` no terminal, dentro da pasta do projeto. | V | O comando `claude` abre a sessão interativa no diretório atual, que passa a ser o projeto de trabalho. | /quickstart |
| beg-06 | O Claude Code só funciona no terminal; não existe integração com IDEs como VS Code ou JetBrains. | F | Há extensões para VS Code e JetBrains, além de app desktop e versão web. | /ide-integrations |
| beg-07 | Shift+Tab alterna entre modos de permissão, como aceitar edições automaticamente e o Plan Mode. | V | O atalho Shift+Tab percorre os modos: padrão, auto-accept de edições e Plan Mode. | /interactive-mode |
| beg-08 | No Plan Mode, o Claude Code já edita os arquivos enquanto monta o plano. | F | O Plan Mode é somente leitura: o Claude analisa e propõe um plano; as edições só acontecem após sua aprovação. | /common-workflows |
| beg-09 | O comando `/compact` resume a conversa para liberar espaço na janela de contexto. | V | O `/compact` condensa o histórico mantendo o essencial, útil em sessões longas. Aceita instruções de foco opcionais. | /slash-commands |
| beg-10 | Digitar `@` seguido do caminho de um arquivo inclui esse arquivo como referência na mensagem. | V | A menção com `@` adiciona arquivos (ou diretórios) ao contexto da conversa, com autocomplete. | /common-workflows |
| beg-11 | `claude --continue` (ou `-c`) retoma a conversa mais recente do diretório atual. | V | O `--continue` reabre a última sessão; `--resume` permite escolher entre sessões anteriores. | /cli-reference |
| beg-12 | O Claude Code não consegue criar commits Git; isso sempre precisa ser feito manualmente. | F | O Claude Code pode usar o Git: criar branches, commits, resolver conflitos e até abrir PRs (com a CLI `gh`). | /common-workflows |
| beg-13 | Pressionar Esc interrompe o Claude enquanto ele trabalha, sem perder o histórico da conversa. | V | Esc para a ação atual e permite redirecionar o Claude; o contexto da conversa é mantido. | /interactive-mode |
| beg-14 | Slash commands como `/clear` e `/compact` só podem ser usados no início de uma sessão. | F | Slash commands podem ser executados a qualquer momento da sessão. | /slash-commands |
| beg-15 | Ao iniciar, o Claude Code carrega todo o código do repositório na janela de contexto. | F | Ele explora o código sob demanda, lendo e buscando apenas os arquivos relevantes para a tarefa. | /overview |

#### Intermediário (customização)
| ID | Afirmação | Resp. | Explicação | Doc |
|---|---|---|---|---|
| int-01 | Skills são pastas com um arquivo SKILL.md que o Claude pode carregar automaticamente quando a tarefa é relevante. | V | O Claude vê o nome e a descrição de cada skill e carrega o conteúdo completo só quando precisa. | /skills |
| int-02 | Subagents trabalham com uma janela de contexto própria, separada da conversa principal. | V | Isso evita poluir o contexto principal: o subagent faz a tarefa e devolve apenas o resultado. | /sub-agents |
| int-03 | Subagents personalizados podem ser definidos como arquivos Markdown com frontmatter YAML em `.claude/agents/`. | V | O frontmatter define nome, descrição, ferramentas e modelo; o corpo é o prompt do subagent. | /sub-agents |
| int-04 | Hooks são sugestões ao modelo, que ele pode decidir ignorar. | F | Hooks são comandos executados pelo próprio Claude Code em eventos definidos — comportamento determinístico, não depende do modelo. | /hooks |
| int-05 | Um hook `PreToolUse` pode bloquear a execução de uma ferramenta antes que ela rode. | V | O `PreToolUse` roda antes da chamada da ferramenta e pode negar a ação (por exemplo, impedir edição de arquivos sensíveis). | /hooks |
| int-06 | O arquivo `.claude/settings.local.json` é feito para ser commitado e compartilhado com o time. | F | O `settings.local.json` é para configurações pessoais e fica fora do Git; o compartilhado é o `.claude/settings.json`. | /settings |
| int-07 | Regras de permissão podem ser definidas no settings.json com listas `allow` e `deny`, como `Bash(npm run test:*)`. | V | As regras permitem liberar ou bloquear ferramentas e comandos específicos sem precisar aprovar a cada vez. | /iam |
| int-08 | Se uma ferramenta aparece em `allow` e em `deny` ao mesmo tempo, a regra `allow` prevalece. | F | Regras de `deny` têm precedência sobre `allow`. | /iam |
| int-09 | É possível criar slash commands personalizados com arquivos Markdown em `.claude/commands/`. | V | Cada arquivo vira um comando reutilizável (ex.: `/revisar`), podendo receber argumentos. | /slash-commands |
| int-10 | Um CLAUDE.md em `~/.claude/CLAUDE.md` vale para todos os seus projetos. | V | Essa é a memória de usuário: preferências pessoais aplicadas em qualquer projeto. | /memory |
| int-11 | Plugins só podem conter slash commands; não podem incluir agents, hooks ou servidores MCP. | F | Plugins empacotam vários componentes: comandos, agents, skills, hooks e servidores MCP. | /plugins |
| int-12 | Output styles permitem mudar o estilo das respostas, como um modo explicativo ou de aprendizado. | V | Output styles alteram o prompt de sistema para adaptar o Claude a outros usos além de engenharia pura. | /output-styles |
| int-13 | Arquivos CLAUDE.md em subdiretórios nunca são lidos pelo Claude Code. | F | CLAUDE.md em subpastas são carregados quando o Claude trabalha com arquivos daquela parte do projeto. | /memory |
| int-14 | Dentro do CLAUDE.md é possível importar outros arquivos com a sintaxe `@caminho/do/arquivo`. | V | Imports permitem modularizar instruções, por exemplo referenciando um README ou guia de estilo. | /memory |
| int-15 | Subagents sempre usam o mesmo modelo da conversa principal; não é possível escolher outro. | F | A definição do subagent pode especificar o modelo (ex.: um mais rápido para tarefas simples). | /sub-agents |

#### Avançado (integrações)
| ID | Afirmação | Resp. | Explicação | Doc |
|---|---|---|---|---|
| adv-01 | O MCP (Model Context Protocol) permite conectar o Claude Code a ferramentas e fontes de dados externas. | V | Com MCP, o Claude pode acessar bancos, issue trackers, APIs e outros sistemas por meio de servidores padronizados. | /mcp |
| adv-02 | O comando `claude mcp add` é usado para adicionar um servidor MCP. | V | A CLI `claude mcp` permite adicionar, listar e remover servidores, com diferentes escopos (local, projeto, usuário). | /mcp |
| adv-03 | Servidores MCP só funcionam localmente via stdio; servidores remotos via HTTP não são suportados. | F | O Claude Code suporta servidores locais (stdio) e remotos (HTTP/SSE), inclusive com autenticação OAuth. | /mcp |
| adv-04 | Um arquivo `.mcp.json` na raiz do projeto permite compartilhar servidores MCP com o time via Git. | V | O escopo de projeto grava a configuração em `.mcp.json`, que pode ser versionado. | /mcp |
| adv-05 | O modo headless (`claude -p "..."`) executa um prompt sem interface interativa, útil em scripts e CI. | V | O modo print roda de forma não interativa e devolve o resultado, ideal para automações. | /headless |
| adv-06 | O modo `-p` só retorna texto puro; não há opção de saída em JSON. | F | O `--output-format` aceita `text`, `json` e `stream-json`, facilitando integração com outras ferramentas. | /headless |
| adv-07 | Existe uma GitHub Action oficial que aciona o Claude ao mencioná-lo com `@claude` em issues e PRs. | V | A Claude Code GitHub Action pode implementar mudanças, revisar PRs e responder em issues. | /github-actions |
| adv-08 | Git worktrees permitem rodar várias sessões do Claude Code em paralelo, cada uma em uma cópia isolada do repositório. | V | Cada worktree tem seus próprios arquivos e branch, evitando que sessões paralelas interfiram entre si. | /common-workflows |
| adv-09 | O Claude Agent SDK permite construir agentes próprios usando a mesma base do Claude Code. | V | O SDK expõe o loop de agente, ferramentas e gestão de contexto para criar agentes customizados. | /sdk |
| adv-10 | A flag `--dangerously-skip-permissions` é recomendada para o uso diário na sua máquina principal. | F | Ela pula todas as aprovações e deve ser usada só em ambientes isolados (ex.: containers sem acesso à internet). | /security |
| adv-11 | Não é possível usar o Claude Code com Amazon Bedrock ou Google Vertex AI. | F | O Claude Code pode ser configurado para usar modelos via Amazon Bedrock e Google Vertex AI. | /third-party-integrations |
| adv-12 | Hooks executam comandos com as permissões do seu usuário, por isso devem ser revisados antes de configurados. | V | Um hook roda automaticamente no seu ambiente; código malicioso ou mal escrito pode causar danos. | /hooks |
| adv-13 | O sandbox do Bash pode restringir o acesso a sistema de arquivos e rede dos comandos executados. | V | O sandboxing isola comandos, reduzindo pedidos de permissão sem abrir mão da segurança. | /sandboxing |
| adv-14 | Subagents podem iniciar outros subagents sem limite, criando aninhamento infinito. | F | Subagents não podem disparar outros subagents; a delegação parte da conversa principal. | /sub-agents |
| adv-15 | Com `claude --resume` é possível escolher qual conversa anterior retomar. | V | O `--resume` abre um seletor de sessões anteriores (ou recebe um ID de sessão diretamente). | /cli-reference |

> Coluna "Doc": caminho relativo a `https://code.claude.com/docs/en`. Ao implementar, conferir se cada URL resolve (o site da documentação pode reorganizar páginas).

---

## 4. Experiência do usuário

### 4.1 Fluxo
```
[Home] --Começar--> [Pergunta n] --Responder--> [Feedback n] --Próxima--> ... --(n=15)--> [Resultado]
                                                                                            |
                                                                          Jogar novamente --+--> [Home]
```

### 4.2 Telas

**Home (`/`)**
- Título, subtítulo ("Teste e aprenda Claude Code em 15 perguntas de Verdadeiro ou Falso").
- Explicação curta: 3 níveis, progressão, feedback com explicação a cada pergunta, ~5 minutos.
- Campo **Apelido (opcional)**, máx. 30 caracteres; valor lembrado em `localStorage` para a próxima partida.
- Botão primário **Começar**.

**Pergunta (`/quiz`)**
- Barra de progresso (1–15) segmentada nas três faixas de nível; indicador do nível atual ("Iniciante", "Intermediário", "Avançado").
- Transição visual ao mudar de nível (ex.: banner "Nível Intermediário" entre a 5ª e a 6ª pergunta).
- Afirmação em destaque.
- Dois botões grandes: **Verdadeiro** e **Falso**. Atalhos de teclado: `V`/`←` e `F`/`→`.
- Após responder, os botões ficam desabilitados (sem trocar de resposta).

**Feedback (mesma rota, estado da pergunta)**
- Indicação clara de **Acertou!** / **Errou!** (cor + ícone + texto, nunca só cor).
- "A resposta correta é: Verdadeiro/Falso".
- Explicação.
- Link **Saiba mais na documentação** (abre em nova aba, `rel="noopener noreferrer"`).
- Botão **Próxima** (atalho `Enter`); na 15ª, **Ver resultado**.

**Resultado (`/quiz` em estado final ou `/resultado`)**
- Acertos: "11 de 15".
- Desempenho por nível: Iniciante x/5, Intermediário x/5, Avançado x/5.
- **Classificação final** (ver §5.3) com nome, ícone/emoji e mensagem.
- Lista de revisão das perguntas erradas (afirmação, resposta correta, link da doc).
- Botão **Jogar novamente** (novo sorteio).
- Mensagem discreta de status do salvamento (não bloqueia a tela se falhar).

### 4.3 Comportamentos
- Recarregar a página no meio da partida: restaurar o progresso a partir de `sessionStorage` (sorteio, respostas, índice atual). Iniciar nova partida limpa esse estado.
- Acessar `/quiz` sem partida ativa: cria uma nova partida (apelido vazio ou o salvo em `localStorage`).
- Animações (Framer Motion): entrada/saída de cards de pergunta, feedback (leve "shake" no erro, "pop" no acerto), barra de progresso, revelação da classificação. Respeitar `prefers-reduced-motion` (desligar ou reduzir animações).

### 4.4 Design
- Mobile first; layout centralizado, largura máx. ~640px para o card da pergunta.
- Tema claro e escuro (seguir `prefers-color-scheme`), tokens de cor no Tailwind.
- Identidade visual inspirada no universo Claude (tons terrosos/laranja como cor de destaque), sem usar logos ou marcas registradas da Anthropic.
- Tipografia legível (corpo ≥ 16px), botões V/F com área de toque ≥ 48px.

### 4.5 Acessibilidade (WCAG 2.1 AA)
- Navegação completa por teclado; foco visível.
- Feedback anunciado por leitor de tela (`aria-live="polite"`).
- Contraste mínimo 4.5:1.
- `lang="pt-BR"` no documento.

---

## 5. Regras de negócio

### 5.1 Sorteio
- Para cada nível, sortear **5 perguntas distintas** entre as 15 disponíveis (Fisher–Yates).
- Ordem final: 5 iniciante → 5 intermediário → 5 avançado; ordem aleatória dentro de cada nível.
- Apenas perguntas com `active: true` entram no sorteio.
- Se um nível tiver menos de 5 perguntas ativas, a aplicação deve falhar no build/teste (validação do banco), não em runtime.

### 5.2 Pontuação
- 1 acerto = 1 ponto. Sem peso por nível, sem tempo, sem streak.
- Pontuação máxima: 15.

### 5.3 Classificação final
| Acertos | Classificação | Mensagem (sugestão) |
|---|---|---|
| 0–5 | 🌱 Explorador | Você está começando a jornada. Explore os links da documentação e tente de novo! |
| 6–9 | 🛠️ Praticante | Você já domina o básico. Hora de aprofundar em customização. |
| 10–12 | 🚀 Especialista | Você manda bem! Falta pouco para dominar as integrações avançadas. |
| 13–15 | 🧠 Power User | Impressionante! Você conhece o Claude Code de ponta a ponta. |

Faixas e textos centralizados em um único módulo de configuração.

### 5.4 Apelido
- Opcional; `trim`, 1–30 caracteres quando informado; vazio vira `null`.
- Caracteres permitidos: letras (incl. acentuadas), números, espaço, `_`, `-`, `.`.
- Não é exibido publicamente no MVP (apenas salvo com o resultado).

### 5.5 Salvamento do resultado
- Ao concluir a 15ª pergunta, o cliente envia **apenas** o apelido, o identificador anônimo e as respostas (`questionId` + `answer`) para a API.
- **O servidor recalcula** acertos e classificação a partir do banco de perguntas (não confia no score enviado pelo cliente).
- Falha no salvamento não impede a exibição do resultado; tentar 1 vez novamente automaticamente e registrar erro no console do servidor.

---

## 6. Arquitetura técnica

### 6.1 Stack
| Camada | Tecnologia |
|---|---|
| Framework | **Next.js** (App Router, versão estável mais recente) |
| Linguagem | **TypeScript** (`strict: true`) |
| Estilo | **Tailwind CSS** |
| Animações | **Framer Motion** (pacote `motion`/`framer-motion`, versão estável atual) |
| Banco de dados | **Supabase** (Postgres) via `@supabase/supabase-js` |
| Validação | **Zod** (payloads da API e schema do banco de perguntas) |
| Testes | **Vitest** (unitários) + **Playwright** (E2E do fluxo principal) |
| Lint/format | ESLint (config do Next) + Prettier |
| Deploy | **Vercel** |
| Gerenciador de pacotes | npm |

### 6.2 Onde ficam as perguntas
- As perguntas ficam **versionadas no repositório**, em `src/data/questions.ts` (array tipado), e **não** no Supabase.
- Motivo: conteúdo revisado via Pull Request, tipagem forte, sem latência de rede e permite que o servidor recalcule a pontuação.
- Manutenção do conteúdo: edição do arquivo + PR. O Supabase guarda apenas resultados (consultados via Supabase Studio).
- O cliente recebe as perguntas com resposta e explicação (necessário para feedback imediato; é um quiz de aprendizado, não uma prova).

### 6.3 Estrutura de pastas sugerida
```
/
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx            # lang="pt-BR", fontes, tema
│  │  ├─ page.tsx              # Home
│  │  ├─ quiz/page.tsx         # Partida + feedback + resultado
│  │  └─ api/sessions/route.ts # POST: salva resultado
│  ├─ components/
│  │  ├─ QuestionCard.tsx
│  │  ├─ AnswerButtons.tsx
│  │  ├─ FeedbackPanel.tsx
│  │  ├─ ProgressBar.tsx
│  │  ├─ LevelBanner.tsx
│  │  └─ ResultSummary.tsx
│  ├─ data/
│  │  └─ questions.ts          # banco de 45 perguntas (§3.3)
│  ├─ lib/
│  │  ├─ quiz/
│  │  │  ├─ draw.ts            # sorteio
│  │  │  ├─ score.ts           # pontuação + classificação
│  │  │  ├─ classification.ts  # faixas (§5.3)
│  │  │  └─ store.ts           # estado da partida (useReducer + sessionStorage)
│  │  ├─ supabase/server.ts    # client com service role (somente servidor)
│  │  └─ schemas.ts            # Zod
│  └─ types/quiz.ts
├─ supabase/
│  └─ migrations/0001_quiz_sessions.sql
├─ tests/
│  ├─ unit/                    # draw, score, classification, validação do banco
│  └─ e2e/quiz.spec.ts
├─ .env.example
└─ README.md
```

### 6.4 Tipos principais
```ts
export type Level = 'beginner' | 'intermediate' | 'advanced';

export interface Question {
  id: string;              // ex.: 'beg-01'
  level: Level;
  topic: string;           // ex.: 'memory', 'hooks', 'mcp'
  statement: string;       // afirmação
  answer: boolean;         // true = Verdadeiro
  explanation: string;
  docUrl: string;          // URL absoluta da doc oficial
  active: boolean;
  verifiedAt: string;      // ISO date da última validação contra a doc
}

export interface UserAnswer {
  questionId: string;
  answer: boolean;
  correct: boolean;
  answeredAt: string;
}

export interface QuizState {
  status: 'idle' | 'playing' | 'finished';
  questionIds: string[];   // 15 ids na ordem da partida
  currentIndex: number;
  answers: UserAnswer[];
  nickname: string | null;
  startedAt: string;
}
```

### 6.5 Estado no cliente
- `useReducer` com ações `START`, `ANSWER`, `NEXT`, `FINISH`, `RESET` (sem lib de estado externa).
- Persistência da partida em andamento em `sessionStorage` (`quiz:state`).
- Em `localStorage`: `quiz:nickname` e `quiz:anonymousId` (UUID v4 gerado no primeiro acesso via `crypto.randomUUID()`).
- Todo acesso a storage envolto em `try/catch` (navegação privada).

---

## 7. Banco de dados (Supabase)

### 7.1 Migration `supabase/migrations/0001_quiz_sessions.sql`
```sql
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
  question_set_version text not null,      -- versão do banco de perguntas (ex.: hash ou semver)
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
```

### 7.2 Segurança
- RLS habilitado e **sem policies públicas**: o navegador nunca fala direto com o Supabase.
- A `SUPABASE_SERVICE_ROLE_KEY` é usada **apenas** no Route Handler (nunca prefixada com `NEXT_PUBLIC_`).
- Importar o client do servidor com `import 'server-only'`.

### 7.3 Variáveis de ambiente (`.env.example`)
```
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

---

## 8. API

### `POST /api/sessions`
**Request (validado com Zod):**
```json
{
  "anonymousId": "uuid",
  "nickname": "string | null",
  "startedAt": "ISO-8601",
  "answers": [{ "questionId": "beg-03", "answer": false }]
}
```
**Validações no servidor:**
- Exatamente 15 respostas, `questionId` únicos e existentes no banco.
- Exatamente 5 por nível, na ordem iniciante → intermediário → avançado.
- `startedAt` no passado e há menos de 24h.
- Apelido conforme §5.4.
- Rate limit simples: máx. 20 requisições/hora por `anonymousId` + IP (contagem na própria tabela ou em memória; aceitável no MVP).

**Processamento:** recalcula `correct` de cada resposta, `score`, scores por nível e `classification`; insere em `quiz_sessions`.

**Respostas:**
- `201 { "id": "uuid", "score": 11, "classification": "especialista" }`
- `400` payload inválido (mensagem genérica, detalhes só no log)
- `429` rate limit
- `500` erro ao salvar

---

## 9. Requisitos não funcionais
- **Performance:** Lighthouse ≥ 90 em Performance, Acessibilidade e Boas Práticas (mobile). Home e quiz renderizáveis estaticamente; só a API é dinâmica.
- **Compatibilidade:** últimas 2 versões de Chrome, Edge, Firefox, Safari (desktop e mobile).
- **SEO/compartilhamento:** `metadata` com título, descrição e imagem Open Graph estática.
- **Privacidade:** nenhum dado pessoal além do apelido opcional; aviso curto na Home: "Salvamos seu resultado de forma anônima para melhorar o quiz."
- **Qualidade:** `npm run lint`, `npm run typecheck`, `npm test` passando antes de cada deploy.

---

## 10. Testes e critérios de aceite

### 10.1 Testes unitários (Vitest)
- `draw`: retorna 15 ids, 5 por nível, na ordem correta, sem repetição, apenas ativos.
- `score`/`classification`: limites das faixas (5, 6, 9, 10, 12, 13, 15).
- **Validação do banco de perguntas** (`questions.ts` passa no schema Zod): ids únicos, ≥ 5 ativas por nível, `docUrl` com `https://code.claude.com/`, limites de tamanho de texto, equilíbrio V/F por nível (§3.2).
- Schema da API: rejeita payloads inválidos (14 respostas, id inexistente, nível fora de ordem, apelido longo).

### 10.2 E2E (Playwright)
- Jogar partida completa só com teclado e ver tela de resultado com classificação.
- Recarregar no meio da partida mantém o progresso.
- Feedback mostra explicação e link da doc após cada resposta.
- Com a API mockada retornando 500, o resultado ainda é exibido.

### 10.3 Critérios de aceite do MVP
- [ ] Usuário consegue jogar 15 perguntas em progressão iniciante → intermediário → avançado.
- [ ] Cada resposta mostra certo/errado, resposta correta, explicação e link.
- [ ] Resultado exibe acertos totais, por nível, classificação e revisão dos erros.
- [ ] "Jogar novamente" gera um novo sorteio.
- [ ] Resultado salvo em `quiz_sessions` com score recalculado no servidor.
- [ ] Nenhuma chave do Supabase exposta no bundle do cliente.
- [ ] Funciona em celular (375px) sem scroll horizontal.
- [ ] Animações desativadas com `prefers-reduced-motion`.
- [ ] Deploy funcionando na Vercel com variáveis de ambiente configuradas.

---

## 11. Plano de implementação (sugestão de etapas)
1. **Setup:** `create-next-app` (TS, Tailwind, ESLint, App Router, `src/`), Prettier, Vitest, Playwright, Framer Motion, Zod.
2. **Dados e lógica:** tipos, `questions.ts` com as 45 perguntas, sorteio, pontuação, classificação + testes unitários.
3. **UI do quiz:** Home, card de pergunta, botões, feedback, barra de progresso, banner de nível, resultado (primeiro sem animação).
4. **Estado:** reducer + persistência em `sessionStorage`/`localStorage`.
5. **Animações e polimento:** Framer Motion, tema escuro, acessibilidade, responsividade.
6. **Backend:** migration Supabase, Route Handler `POST /api/sessions`, integração no fim da partida.
7. **Qualidade:** testes E2E, Lighthouse, revisão das perguntas contra a documentação (`verifiedAt`).
8. **Deploy:** projeto na Vercel, variáveis de ambiente, README com instruções de setup local e do Supabase.

---

## 12. Evoluções futuras (pós-MVP)
- Ranking público por apelido (requer moderação de apelidos e policy de leitura).
- Estatísticas por pergunta ("62% erraram esta") a partir de `quiz_sessions.answers`.
- Compartilhamento do resultado (LinkedIn, X, WhatsApp) com imagem OG dinâmica.
- Banco ampliado (90+ perguntas) e modo "escolher nível".
- Login com Supabase Auth para histórico entre dispositivos.
- Painel admin para conteúdo e métricas.
- Versão em inglês.

---

## 13. Decisões registradas no brainstorm
| Tema | Decisão |
|---|---|
| Público | Pessoas interessadas em IA, Claude Code e programação |
| Objetivo | Aprendizado |
| Dificuldade | Progressão contínua dentro da partida |
| Idioma | pt-BR |
| Tamanho | 15 perguntas por partida (5 por nível) |
| Feedback | Imediato, com explicação e link da doc |
| Gamificação | Apenas classificação final |
| Temas | Dia a dia, customização, avançado/integrações (sem negócio/preços) |
| Banco | 45 perguntas, sorteio a cada partida |
| Stack | Next.js + TypeScript + Tailwind + Framer Motion |
| Backend | Supabase — somente resultados das partidas |
| Identidade | Anônimo com apelido opcional |
| Admin | Sem painel; conteúdo via repositório, resultados via Supabase Studio |
| Deploy | Vercel |
