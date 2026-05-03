# Changelog

## [1.3.0] — 2026-05-03
### Added
- **Live deploy: https://getyuktiai.netlify.app/** (Netlify-hosted).
- `netlify.toml` with security headers + SPA redirect rule.
- Live-demo badge + nav link on every page.

### Changed
- `scripts/deploy.sh` now ships the static site to Netlify (was Vercel).
- README features the live URL prominently.
- `.env.example` swapped Vercel keys for Netlify keys.

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
  (Supabase free tier + n8n self-hosted on a $4 droplet + Netlify free).

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
