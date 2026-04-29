-- ============================================================================
-- 20260410_kpi_snapshots.sql : daily per-agent KPI snapshots for the dashboard
-- ============================================================================
create table if not exists public.agent_kpi_snapshots (
    tenant_id   uuid not null references public.tenants(id) on delete cascade,
    agent_id    text not null,
    snapshot_d  date not null,
    metrics     jsonb not null,
    primary key (tenant_id, agent_id, snapshot_d)
);
