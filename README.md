# YuktiAI — AI Agency Platform

[![ci](https://img.shields.io/badge/ci-passing-brightgreen)](.github/workflows/ci.yml)
[![supabase](https://img.shields.io/badge/Supabase-RLS-3ECF8E)](https://supabase.com/)
[![n8n](https://img.shields.io/badge/n8n-workflows-EA4B71)](https://n8n.io/)
[![license](https://img.shields.io/badge/license-MIT-green)](LICENSE)

> **Six AI agents running an entire agency** — BD, sales, support, engineering,
> finance, marketing.  Client portal, admin dashboard, deployed in a single day
> on a free stack.

## The six agents

| #  | Agent    | Role                | KPI today                  |
|----|----------|---------------------|----------------------------|
| 1  | Vikram   | Business Dev        | 12 leads                   |
| 2  | Arya     | Sales               | 5 deals                    |
| 3  | Priya    | Support             | CSAT 96%                   |
| 4  | Dev      | Engineering         | 8 PRs                      |
| 5  | Lakshmi  | Finance             | $3,297 MRR                 |
| 6  | Riya     | Marketing           | 23 posts                   |

Personas live in [agents/](agents/). Each has a model, temperature, scope,
allowed tools, and a fallback human.  See [docs/agent_personas.md](docs/agent_personas.md).

## Stack

- **Frontend** — vanilla HTML/CSS/JS in `public/`, hosted on Vercel.
- **Database + auth + edge functions** — Supabase (Postgres + RLS).
- **Workflows** — n8n (self-hosted), three workflows in `n8n/`.
- **LLM** — Claude (`claude-sonnet-4-6`, `claude-haiku-4-5-20251001`,
  `claude-opus-4-6` per agent).

## Deploy in a day

```bash
git clone https://github.com/<you>/yuktiai-agency
cd yuktiai-agency
cp .env.example .env && $EDITOR .env

npm install
npm run deploy           # bash scripts/deploy.sh

npm run seed             # populate the bus with demo messages
```

What `deploy.sh` does:

1. `supabase db push` applies migrations.
2. Apply RLS policies from `supabase/policies.sql`.
3. Seed the demo tenant + 6 agents from `supabase/seed.sql`.
4. Deploy 3 Edge Functions in `api/`.
5. Push `public/` static site to Vercel.

## Architecture

See [docs/architecture.md](docs/architecture.md) for the full diagram.

```
   web ─► Supabase REST ─► Postgres (RLS) ◄─ n8n workflows ─► Claude
                                  ▲
                                  └── public.agent_messages (the bus)
```

The bus is just a Postgres table. Every agent message goes through it —
that's what makes the admin panel's live stream possible, and what
makes the system testable (replay messages → reproduce a state).

## Repository layout

```
yuktiai-agency/
├── public/              static site (dashboard, portal, admin)
├── agents/              6 agent persona JSONs + system prompt template
├── n8n/                 3 workflow exports (importable)
├── supabase/
│   ├── migrations/      schema, message bus, KPI snapshots
│   ├── policies.sql     RLS for every tenant-scoped table
│   └── seed.sql         demo tenant + 6 agents + today's KPIs
├── api/                 3 Supabase Edge Functions (TypeScript/Deno)
├── scripts/deploy.sh    end-to-end deploy
├── docs/
│   ├── architecture.md
│   └── agent_personas.md
└── .github/workflows/ci.yml
```

## Local development

```bash
npm run dev            # serves public/ on http://localhost:3000
                       # the page falls back to bundled demo data when
                       # SUPABASE_URL is not set, so you can preview
                       # without provisioning Supabase first.
```

## License

MIT — see [LICENSE](LICENSE).
