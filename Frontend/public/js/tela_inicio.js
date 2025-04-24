document.addEventListener('DOMContentLoaded', async () => {
  // Exibe data
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  document.getElementById('current-date').textContent = new Date().toLocaleDateString('pt-BR', options);

  let userRole = '';
  // Busca usuário atual
  try {
    const userRes = await fetch('/api/auth/me', { credentials: 'include' });
    if (userRes.ok) {
      const user = await userRes.json();
      document.getElementById('usuario-nome').textContent = user.username;
      document.getElementById('usuario-papel').textContent = user.role;
      userRole = user.role;
    }
  } catch (e) {
    console.warn('Não foi possível obter dados do usuário', e);
  }

// Ajusta visibilidade de elementos apenas para admin
const adminEls = document.querySelectorAll('.admin-only');
if (userRole === 'admin') {
  adminEls.forEach(el => el.style.display = 'block');
} else {
  adminEls.forEach(el => el.style.display = 'none');
}


  // Busca todos os casos
  let casos = [];
  try {
    const res = await fetch('/api/casos', { credentials: 'include' });
    casos = await res.json();
  } catch (e) {
    console.error('Erro ao buscar casos', e);
  }

  // Atualiza cards de resumo
  const statusCount = { 'Em andamento': 0, 'Finalizado': 0, 'Arquivado': 0 };
  casos.forEach(c => statusCount[c.status]++);
  document.getElementById('casos-abertos').textContent = statusCount['Em andamento'];
  document.getElementById('casos-encerrados').textContent = statusCount['Finalizado'];
  document.getElementById('casos-arquivados').textContent = statusCount['Arquivado'];

  // Gráfico de status
  const statusCtx = document.getElementById('status-chart').getContext('2d');
  new Chart(statusCtx, {
    type: 'doughnut',
    data: {
      labels: Object.keys(statusCount),
      datasets: [{ data: Object.values(statusCount) }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });

  // Gráfico de tipos
  const typeMap = {};
  casos.forEach(c => { const t = c.contexto.tipoCaso; typeMap[t] = (typeMap[t]||0)+1; });
  const typeCtx = document.getElementById('type-chart').getContext('2d');
  new Chart(typeCtx, {
    type: 'bar',
    data: { labels: Object.keys(typeMap), datasets: [{ data: Object.values(typeMap) }] },
    options: { responsive: true, maintainAspectRatio: false, scales: { x:{ beginAtZero:true }, y:{ beginAtZero:true } } }
  });

  // Gráfico de peritos
  const expertMap = {};
  casos.forEach(c => { const r = c.responsavel; expertMap[r] = (expertMap[r]||0)+1; });
  const expertCtx = document.getElementById('expert-chart').getContext('2d');
  new Chart(expertCtx, {
    type: 'bar', indexAxis: 'y',
    data: { labels: Object.keys(expertMap), datasets: [{ data: Object.values(expertMap) }] },
    options: { responsive: true, maintainAspectRatio: false, scales:{ x:{ beginAtZero:true } } }
  });

  // Recentes atividades (audit logs)
  try {
    const actRes = await fetch('/api/audit-logs', { credentials: 'include' });
    if (actRes.ok) {
      const logs = await actRes.json();
      const list = document.getElementById('activity-list');
      logs.slice(0,5).forEach(log => {
        const item = document.createElement('div'); item.classList.add('activity-item');
        item.innerHTML = `
          <div class="activity-content">
            <p class="activity-text"><strong>${log.action}</strong> – ${log.details}</p>
            <p class="activity-meta">Por: ${log.user} | ${new Date(log.timestamp).toLocaleString('pt-BR')}</p>
          </div>`;
        list.append(item);
      });
    }
  } catch (e) { console.warn('Erro ao buscar atividades', e); }

  // Casos recentes
  const recentBody = document.getElementById('recent-cases-body');
  casos.sort((a,b)=> new Date(b.dataAbertura) - new Date(a.dataAbertura)).slice(0,5)
    .forEach(c => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${c.titulo}</td>
        <td>${c.contexto.tipoCaso}</td>
        <td><span class="status-badge ${c.status==='Em andamento'?'open':c.status==='Finalizado'?'closed':'archived'}">${c.status}</span></td>
        <td>${new Date(c.dataAbertura).toLocaleDateString('pt-BR')}</td>
        <td>${c.responsavel}</td>
        <td>
          <button class="table-btn view-btn">Ver</button>
          <button class="table-btn edit-btn admin-perito">Editar</button>
        </td>`;
      recentBody.append(tr);
    });
});