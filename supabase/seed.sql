-- Seed a demo tenant with the six agents.
insert into public.tenants (id, slug, display_name, plan)
values ('11111111-1111-1111-1111-111111111111', 'yuktiai-demo', 'YuktiAI Demo', 'pro')
on conflict (id) do nothing;

insert into public.agents (id, tenant_id, display_name, role, config_json) values
  ('vikram',  '11111111-1111-1111-1111-111111111111', 'Vikram',  'Business Development',
   '{"avatar_color":"#7B66FF","model":"claude-sonnet-4-6"}'),
  ('arya',    '11111111-1111-1111-1111-111111111111', 'Arya',    'Sales',
   '{"avatar_color":"#9B7BC8","model":"claude-sonnet-4-6"}'),
  ('priya',   '11111111-1111-1111-1111-111111111111', 'Priya',   'Customer Support',
   '{"avatar_color":"#E36F4C","model":"claude-haiku-4-5-20251001"}'),
  ('dev',     '11111111-1111-1111-1111-111111111111', 'Dev',     'Engineering',
   '{"avatar_color":"#D4A14A","model":"claude-opus-4-6"}'),
  ('lakshmi', '11111111-1111-1111-1111-111111111111', 'Lakshmi', 'Finance',
   '{"avatar_color":"#7E3F8F","model":"claude-sonnet-4-6"}'),
  ('riya',    '11111111-1111-1111-1111-111111111111', 'Riya',    'Marketing',
   '{"avatar_color":"#3D8856","model":"claude-sonnet-4-6"}')
on conflict (id) do nothing;

-- Seed today's KPIs to populate the dashboard cards
insert into public.agent_kpi_snapshots (tenant_id, agent_id, snapshot_d, metrics) values
  ('11111111-1111-1111-1111-111111111111', 'vikram',  current_date, '{"leads": 12}'),
  ('11111111-1111-1111-1111-111111111111', 'arya',    current_date, '{"deals": 5}'),
  ('11111111-1111-1111-1111-111111111111', 'priya',   current_date, '{"csat": 0.96}'),
  ('11111111-1111-1111-1111-111111111111', 'dev',     current_date, '{"prs_open": 8}'),
  ('11111111-1111-1111-1111-111111111111', 'lakshmi', current_date, '{"mrr_usd": 3297}'),
  ('11111111-1111-1111-1111-111111111111', 'riya',    current_date, '{"posts": 23}')
on conflict (tenant_id, agent_id, snapshot_d) do update set metrics = excluded.metrics;
