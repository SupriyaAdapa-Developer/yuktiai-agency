-- ============================================================================
-- policies.sql : Row-Level Security for every tenant-scoped table
-- ============================================================================
alter table public.tenants            enable row level security;
alter table public.profiles           enable row level security;
alter table public.agents             enable row level security;
alter table public.tasks              enable row level security;
alter table public.agent_messages     enable row level security;
alter table public.agent_kpi_snapshots enable row level security;

-- Helper: which tenant the current auth.uid() belongs to.
create or replace function public.current_tenant_id() returns uuid
language sql security definer stable as $$
    select tenant_id from public.profiles where id = auth.uid()
$$;

-- Tenants: owners read their own row.
create policy "tenant self-read" on public.tenants
    for select using (id = public.current_tenant_id());

-- Profiles: read your own + others in same tenant; modify only your own.
create policy "profiles tenant-scope read" on public.profiles
    for select using (tenant_id = public.current_tenant_id());
create policy "profiles self-modify" on public.profiles
    for update using (id = auth.uid());

-- Agents: tenant-scoped CRUD for owners/admins.
create policy "agents tenant scope" on public.agents
    for all using (tenant_id = public.current_tenant_id());

-- Tasks, messages, kpis: tenant-scoped read; writes via service role only.
create policy "tasks tenant scope read" on public.tasks
    for select using (tenant_id = public.current_tenant_id());
create policy "messages tenant scope read" on public.agent_messages
    for select using (tenant_id = public.current_tenant_id());
create policy "kpi tenant scope read" on public.agent_kpi_snapshots
    for select using (tenant_id = public.current_tenant_id());
