document.addEventListener("DOMContentLoaded", async () => {
    // Ajustes de data
    const hoje = new Date();
    document.getElementById('current-date').textContent = hoje.toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' });
    document.getElementById('current-year').textContent = hoje.getFullYear();
  
    // Obter dados do usuário para controle de roles
    let userRole = null;
    try {
      const respUser = await fetch('/api/auth/me', { credentials: 'include' });
      if (respUser.ok) {
        const user = await respUser.json();
        userRole = user.role;
      }
    } catch (e) {
      console.error('Falha ao obter usuário:', e);
    }
  
    // Controlar botão de novo caso
    const newCaseBtn = document.getElementById('new-case-btn');
    if (userRole === 'assistente') newCaseBtn.style.display = 'none';
    else newCaseBtn.addEventListener('click', () => window.location.href = '/cadastro_caso1.html');
  
    // Buscar e renderizar casos
    const allCases = await fetchCasesData();
    let currentPage = 1;
    const itemsPerPage = 6;
  
    // Carregar página
    function loadPage(page) {
      currentPage = page;
      const statusFilter = document.getElementById('filter-status').value;
      const typeFilter = document.getElementById('filter-type').value;
      const searchQuery = document.getElementById('search-input').value.toLowerCase();
  
      let filtered = allCases
        .filter(c => statusFilter === 'todos' || c.status === statusFilter)
        .filter(c => typeFilter === 'todos' || (c.contexto?.tipoCaso === typeFilter))
        .filter(c => !searchQuery || c.titulo.toLowerCase().includes(searchQuery) || c.numeroCaso.toLowerCase().includes(searchQuery));
  
      const total = filtered.length;
      const start = (page - 1) * itemsPerPage;
      const pageItems = filtered.slice(start, start + itemsPerPage);
  
      renderCaseCards(pageItems, userRole);
      createPagination(total, itemsPerPage, page);
    }
  
    loadPage(1);
  
    // Filtros e busca
    document.getElementById('filter-status').addEventListener('change', () => loadPage(1));
    document.getElementById('filter-type').addEventListener('change', () => loadPage(1));
    document.getElementById('search-btn').addEventListener('click', () => loadPage(1));
    document.getElementById('search-input').addEventListener('keypress', e => { if (e.key === 'Enter') loadPage(1); });
  
    // Funções auxiliares abaixo
  
    async function fetchCasesData() {
      try {
        const resp = await fetch('/api/casos', { credentials: 'include' });
        return resp.ok ? resp.json() : [];
      } catch (e) {
        console.error('Erro ao carregar casos:', e);
        return [];
      }
    }
  
    function renderCaseCards(casos, role) {
      const container = document.getElementById('cases-container');
      container.innerHTML = '';
      if (!casos.length) {
        container.innerHTML = '<p class="no-results">Nenhum caso encontrado.</p>';
        return;
      }
  
      casos.forEach(c => {
        const statusClass = c.status === 'Finalizado' ? 'status-finalizado' : c.status === 'Arquivado' ? 'status-arquivado' : 'status-aberto';
        const dataFmt = new Date(c.dataAbertura).toLocaleDateString('pt-BR');
  
        // Controle de visibilidade de botões
        const canEvidence = role === 'admin' || role === 'assistente';
        const canReport   = role !== 'assistente';
        const canEdit     = role === 'admin' || role === 'perito';
  
        container.insertAdjacentHTML('beforeend', `
          <div class="case-card" data-id="${c.numeroCaso}">
            <div class="case-header">
              <h3 class="case-title">${c.titulo}</h3>
              <span class="case-type">${c.contexto.tipoCaso}</span>
            </div>
            <div class="case-body">
              <p><strong>Código:</strong> #${c.numeroCaso}</p>
              <p><strong>Data:</strong> ${dataFmt}</p>
              <p><strong>Responsável:</strong> ${c.responsavel}</p>
              <p><strong>Status:</strong> <span class="status-indicator ${statusClass}"></span> ${c.status}</p>
              <div class="case-actions">
                <a href="detalhes_caso.html?id=${encodeURIComponent(c.numeroCaso)}"><button class="btn-view">Visualizar</button></a>
                ${canEvidence ? `<a href="evidencia.html?id=${encodeURIComponent(c.numeroCaso)}"><button class="btn-evidence">Evidências</button></a>` : ''}
                ${canReport   ? `<a href="relatorio.html?id=${encodeURIComponent(c.numeroCaso)}"><button class="btn-report">Relatório</button></a>` : ''}
                ${canEdit     ? `<a href="detalhes_caso.html?id=${encodeURIComponent(c.numeroCaso)}&editar=true"><button class="btn-edit">Editar</button></a>` : ''}
              </div>
            </div>
          </div>
        `);
      });
    }
  
    function createPagination(totalItems, perPage, current) {
      const totalPages = Math.ceil(totalItems / perPage);
      const pag = document.getElementById('pagination-container');
      pag.innerHTML = '';
      if (totalPages < 2) return;
  
      const btn = (text, disabled, cb) => {
        const b = document.createElement('button'); b.innerHTML = text; b.disabled = disabled; b.onclick = cb; return b;
      };
      pag.appendChild(btn('&laquo;', current === 1, () => loadPage(current - 1)));
      for (let i = 1; i <= totalPages; i++) {
        const b = btn(i, false, () => loadPage(i));
        if (i === current) b.classList.add('active');
        pag.appendChild(b);
      }
      pag.appendChild(btn('&raquo;', current === totalPages, () => loadPage(current + 1)));
    }
  });