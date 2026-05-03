/* YuktiAI front-end — minimal interactivity layer.
   Most content is rendered server-side / static; this file handles
   form submission + the "live" timestamp on the dashboard header. */

(() => {
    // Live timestamp on dashboard header
    const today = document.getElementById('todayLabel');
    if (today) {
        const opts = { weekday: 'long', month: 'short', day: 'numeric' };
        const now  = new Date();
        const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        today.textContent = `${now.toLocaleDateString([], opts)} · ${time} IST`;
    }

    // Request form -> prepend a new row to the task table
    const form = document.getElementById('requestForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const fd    = new FormData(form);
            const body  = (fd.get('body') || '').trim();
            const route = fd.get('route');
            if (!body) return;

            const tbl = document.querySelector('#taskTable tbody');
            if (!tbl) return;

            const agent = route === 'auto' ? 'Auto-router' :
                route.charAt(0).toUpperCase() + route.slice(1);

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${escapeHtml(body.slice(0, 80))}${body.length > 80 ? '…' : ''}</strong>
                    <div style="color:var(--text-mute); font-size:12px">Just submitted · waiting on ${escapeHtml(agent)}</div></td>
                <td>${escapeHtml(agent)}</td>
                <td><span class="status-pill paused">Queued</span></td>
                <td style="text-align:right; font-family: var(--font-mono); color: var(--text-mute)">just now</td>
            `;
            tbl.prepend(tr);
            form.reset();

            // Brief flash on the new row
            tr.animate(
                [
                    { background: 'rgba(139,92,246,0.15)' },
                    { background: 'transparent' }
                ],
                { duration: 1400, easing: 'ease-out' }
            );
        });
    }

    function escapeHtml(s) {
        return String(s)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }
})();
