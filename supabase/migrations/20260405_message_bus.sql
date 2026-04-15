-- ============================================================================
-- 20260405_message_bus.sql : inter-agent message bus (append-only)
-- ============================================================================
create table if not exists public.agent_messages (
    id              bigserial primary key,
    tenant_id       uuid not null references public.tenants(id) on delete cascade,
    from_agent      text not null,
    to_agent        text not null,
    topic           text not null,
    payload_json    jsonb not null,
    created_at      timestamptz not null default now()
);
create index if not exists idx_agent_messages_tenant_created
    on public.agent_messages(tenant_id, created_at desc);
create index if not exists idx_agent_messages_to_agent
    on public.agent_messages(to_agent, created_at desc);
