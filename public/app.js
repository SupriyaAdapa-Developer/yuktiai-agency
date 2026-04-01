/* YuktiAI front-end. Single-file vanilla JS shared by all three pages.
   Reads `agents` config + KPIs from the Supabase REST API when available,
   falls back to bundled demo data otherwise. */

const SUPABASE_URL  = window.YUKTI_CONFIG?.supabaseUrl  || '';
const SUPABASE_ANON = window.YUKTI_CONFIG?.supabaseAnon || '';
const TENANT_ID     = window.YUKTI_CONFIG?.tenantId     || '11111111-1111-1111-1111-111111111111';

// ---------- Demo fallback data (matches public seed.sql) ----------
const DEMO = {
  agents: [
    { id: 'vikram',  display_name: 'Vikram',  role: 'Business Dev',     avatar_color: '#7B66FF',
      kpi_label: 'leads',  kpi_value: 12,    kpi_max: 35  },
    { id: 'arya',    display_name: 'Arya',    role: 'Sales',            avatar_color: '#9B7BC8',
      kpi_label: 'deals',  kpi_value: 5,     kpi_max: 8   },
    { id: 'priya',   display_name: 'Priya',   role: 'Support',          avatar_color: '#E36F4C',
      kpi_label: 'CSAT %', kpi_value: 96,    kpi_max: 100 },
    { id: 'dev',     display_name: 'Dev',     role: 'Engineering',      avatar_color: '#D4A14A',
      kpi_label: 'PRs',    kpi_value: 8,     kpi_max: 10  },
    { id: 'lakshmi', display_name: 'Lakshmi', role: 'Finance',          avatar_color: '#7E3F8F',
      kpi_label: 'MRR',    kpi_value: 3297,  kpi_max: 5000, prefix: '$' },
    { id: 'riya',    display_name: 'Riya',    role: 'Marketing',        avatar_color: '#3D8856',
      kpi_label: 'posts',  kpi_value: 23,    kpi_max: 30  },
  ],
  recentMessages: [
    { from: 'vikram',  to: 'arya',   topic: 'qualified_lead',  ts: '14:02', body: 'Acme Logistics — buying signal' },
    { from: 'priya',   to: 'lakshmi', topic: 'refund_request', ts: '14:11', body: 'Ticket #482 needs refund approval' },
    { from: 'lakshmi', to: 'priya',   topic: 'refund_approved', ts: '14:14', body: 'Refund $99 approved on stripe_re_xyz' },
    { from: 'riya',    to: 'dev',    topic: 'analytics_query', ts: '14:20', body: 'Need pageviews-per-post for the weekly digest' },
    { from: 'dev',     to: 'riya',   topic: 'analytics_reply', ts: '14:22', body: 'Top post: 1,841 views (Apr 21)' },
  ],
  recentTasks: [
    { id: 't_001', title: 'Find 15 fintech contacts in Bangalore', agent: 'vikram',  status: 'done' },
    { id: 't_002', title: 'Draft proposal for Citrine Health',     agent: 'arya',    status: 'running' },
    { id: 't_003', title: 'Refund ticket #482',                    agent: 'priya',   status: 'done' },
    { id: 't_004', title: 'Open PR: fix RLS leak in v_messages',   agent: 'dev',     status: 'queued' },
  ],
};

const initials = (name) => name[0].toUpperCase();

// ---------- Supabase REST helper (no client SDK needed) ----------
async function sb(path, init = {}) {
  if (!SUPABASE_URL) return null;
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: SUPABASE_ANON,
      Authorization: `Bearer ${SUPABASE_ANON}`,
      'Content-Type': 'application/json',
      ...init.headers,
    },
  });
  if (!r.ok) {
    console.warn('Supabase fetch failed:', r.status, path);
    return null;
  }
  return r.json();
}

async function loadAgents() {
  const remote = await sb(
    `agents?tenant_id=eq.${TENANT_ID}&is_active=is.true&select=id,display_name,role,config_json`
  );
  if (!remote || !remote.length) return DEMO.agents;
  return remote.map((a) => ({
    id: a.id,
    display_name: a.display_name,
    role: a.role,
    avatar_color: a.config_json?.avatar_color || '#999',
    kpi_label: 'tasks',
    kpi_value: 0,
    kpi_max: 10,
  }));
}

// ---------- Renderers ----------
function renderAgentCards(target, agents) {
  target.innerHTML = '';
  for (const a of agents) {
    const pct = Math.min(100, Math.round((a.kpi_value / a.kpi_max) * 100));
    const card = document.createElement('div');
    card.className = 'agent-card';
    card.style.setProperty('--col', a.avatar_color);
    card.style.setProperty('--pct', pct + '%');
    card.innerHTML = `
      <div class="head">
        <div class="avatar">${initials(a.display_name)}</div>
        <div class="who">
          <div class="name">${a.display_name}</div>
          <div class="role">${a.role}</div>
        </div>
      </div>
      <div class="kpi">${a.prefix || ''}${a.kpi_value.toLocaleString()} ${a.kpi_label}</div>
      <div class="bar"><span></span></div>
    `;
    target.appendChild(card);
  }
}

function renderTaskList(target, tasks) {
  target.innerHTML = '';
  for (const t of tasks) {
    const li = document.createElement('li');
    const cls = t.status === 'done' ? 'done' : t.status === 'running' ? 'running' : '';
    li.innerHTML = `
      <span><b>${t.title}</b><br/><span class="role">→ ${t.agent}</span></span>
      <span class="pill ${cls}">${t.status}</span>
    `;
    target.appendChild(li);
  }
}

function renderMessages(target, messages) {
  target.innerHTML = '';
  for (const m of messages) {
    const li = document.createElement('li');
    li.innerHTML = `<span class="ts">${m.ts}</span> <b>${m.from}</b> → <b>${m.to}</b> · ${m.topic}<br/>${m.body}`;
    target.appendChild(li);
  }
}

function renderAgentConfigTable(target, agents) {
  const tbody = target.querySelector('tbody');
  tbody.innerHTML = '';
  for (const a of agents) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${a.display_name} <span class="role">(${a.role})</span></td>
      <td><code>${a.model || 'claude-sonnet-4-6'}</code></td>
      <td>✓</td>
      <td><a href="#" data-id="${a.id}">edit</a></td>
    `;
    tbody.appendChild(tr);
  }
}

// ---------- Page boot ----------
async function boot() {
  const agents = await loadAgents();

  const grid = document.getElementById('agentGrid');
  if (grid) renderAgentCards(grid, agents);

  const tasks = document.getElementById('taskList');
  if (tasks) renderTaskList(tasks, DEMO.recentTasks);

  const stream = document.getElementById('messageStream');
  if (stream) renderMessages(stream, DEMO.recentMessages);

  const cfg = document.getElementById('agentConfigTable');
  if (cfg) renderAgentConfigTable(cfg, agents);

  const form = document.getElementById('requestForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const route = fd.get('route');
      const body  = fd.get('body');
      DEMO.recentTasks.unshift({
        id: 't_' + Date.now().toString(36),
        title: body.slice(0, 60) + (body.length > 60 ? '…' : ''),
        agent: route === 'auto' ? 'router' : route,
        status: 'queued',
      });
      renderTaskList(document.getElementById('taskList'), DEMO.recentTasks);
      form.reset();
    });
  }
}
boot();
