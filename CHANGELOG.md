# Changelog

## [1.2.0] — 2026-04-29
### Added
- Daily-digest n8n workflow (`workflow_daily_digest.json`) — emails the
  founder a 4-line summary of yesterday at 9am IST.
- `agent_kpi_snapshots` migration so the dashboard cards have a proper
  source instead of hardcoded numbers.

### Changed
- README rewritten with deploy-in-a-day quickstart.

## [1.1.0] — 2026-04-22
### Added
- Client portal (`public/client.html`) — customers submit requests that
  auto-route to the right agent.
- Admin dashboard (`public/admin.html`) — agent runtime config table + live
  message-bus stream.

## [1.0.0] — 2026-04-15
### Added
- **Production launch.** Six agents online, message bus active, Supabase
  RLS verified, n8n workflows deployed. Total stack cost: $0/month
  (Supabase free tier + n8n self-hosted on a $4 droplet + Vercel free).

### Added
- Three n8n workflows: inter-agent bus, lead intake, daily digest.
- Three Supabase Edge Functions: agents, messages, webhook.

## [0.2.0] — 2026-04-08
### Added
- Six agent persona JSONs (Vikram, Arya, Priya, Dev, Lakshmi, Riya).
- System-prompt template.

## [0.1.0] — 2026-04-01
### Added
- Initial commit. Supabase schema (tenants, profiles, agents, tasks).
- Static landing page skeleton.
