# Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│  Public web (Vercel-hosted static site)                             │
│   public/ → index.html (dashboard) · client.html · admin.html       │
└──────────────────────────────┬──────────────────────────────────────┘
                               │ Supabase JS REST + auth
┌──────────────────────────────▼──────────────────────────────────────┐
│  Supabase                                                           │
│   • Postgres tables: tenants, profiles, agents, tasks,              │
│     agent_messages (the bus), agent_kpi_snapshots                   │
│   • RLS policies → tenant-scope every read                          │
│   • Edge functions: api/agents.ts · api/messages.ts · api/webhook.ts│
└────┬─────────────────────────────────┬──────────────────────────────┘
     │                                 │
     ▼                                 ▼
┌──────────────┐                 ┌─────────────────────────────────┐
│ n8n          │   webhooks      │ Claude (Anthropic API)          │
│ workflows/   ├─────────────────►   each agent calls Claude with  │
│  inter-agent │                 │   its own system prompt + tools │
│  lead-intake │                 └─────────────────────────────────┘
│  daily-digest│
└──────────────┘
```

## The six agents

| Agent    | Role            | Model                       | Notes                              |
|----------|-----------------|-----------------------------|------------------------------------|
| Vikram   | BD              | claude-sonnet-4-6           | Discovers + qualifies leads        |
| Arya     | Sales           | claude-sonnet-4-6           | Owns the pipeline, never closes alone |
| Priya    | Support         | claude-haiku-4-5-20251001   | Fast first-response on tickets     |
| Dev      | Engineering     | claude-opus-4-6             | Opens PRs, never merges            |
| Lakshmi  | Finance         | claude-sonnet-4-6           | Stripe + invoices, flags anomalies |
| Riya     | Marketing       | claude-sonnet-4-6           | Drafts; founder approves           |

All agents share the message bus (`public.agent_messages`), so when Vikram
qualifies a lead he posts `{from:'vikram', to:'arya', topic:'qualified_lead'}`
and Arya picks it up on her next loop.
