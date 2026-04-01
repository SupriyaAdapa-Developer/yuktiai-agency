-- ============================================================================
-- 20260401_initial_schema.sql : tenants, profiles, agents, tasks
-- ============================================================================
create extension if not exists "pgcrypto";

create table if not exists public.tenants (
    id              uuid primary key default gen_random_uuid(),
    slug            text not null unique,
    display_name    text not null,
    plan            text not null default 'free' check (plan in ('free','pro','enterprise')),
    created_at      timestamptz not null default now()
);

create table if not exists public.profiles (
    id              uuid primary key references auth.users(id) on delete cascade,
    tenant_id       uuid not null references public.tenants(id) on delete cascade,
    email           text not null,
    role            text not null default 'member' check (role in ('owner','admin','member','viewer')),
    created_at      timestamptz not null default now()
);
create index if not exists idx_profiles_tenant on public.profiles(tenant_id);

create table if not exists public.agents (
    id              text primary key,         -- e.g. 'vikram', 'arya'
    tenant_id       uuid not null references public.tenants(id) on delete cascade,
    display_name    text not null,
    role            text not null,
    config_json     jsonb not null,
    is_active       boolean not null default true,
    created_at      timestamptz not null default now()
);

create table if not exists public.tasks (
    id              uuid primary key default gen_random_uuid(),
    tenant_id       uuid not null references public.tenants(id) on delete cascade,
    agent_id        text not null,
    kind            text not null,
    status          text not null default 'queued' check (status in ('queued','running','done','failed','cancelled')),
    payload_json    jsonb,
    result_json     jsonb,
    created_at      timestamptz not null default now(),
    completed_at    timestamptz
);
create index if not exists idx_tasks_tenant_status on public.tasks(tenant_id, status, created_at desc);
