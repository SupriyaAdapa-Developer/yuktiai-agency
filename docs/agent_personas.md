# Agent personas

Each agent has its persona in `agents/<agent>.json`. The runtime loader
prepends the system-prompt template (`agents/system_prompt_template.md`)
plus a JSON-formatted block of the agent's own config.

## Editing personas

Edit the JSON; redeploy with `npm run deploy`. The agents table in Supabase
gets upserted from `supabase/seed.sql` on deploy, so the runtime always
reads the current persona.

## Adding an agent

1. Drop a new `agents/<id>.json` with the same shape.
2. Append a row to `supabase/seed.sql` so the dashboard renders a card for it.
3. Wire any tools the agent needs in `n8n/` (a tool is just a webhook).
4. Ship it: `npm run deploy`.

## What "tone" means

`tone` is rendered into the system prompt as a single line.  Keep it under
12 words and write it as instructions, not adjectives:

>  WRONG: "professional, smart, helpful"
>  RIGHT: "consultative, never pushy; always quote real numbers"
