// Variáveis de controle
let currentPage = 1;
const rowsPerPage = 10;
let currentSort = { column: 'username', direction: 'asc' };
let totalUsers = 0;
let searchTerm = '';
let userToDeleteId = null;

// Configurações da API
const API_BASE_URL = '/api/users';

// Função para formatar dados como no mock
const formatUserData = (user) => ({
  ...user,
  nome: user.username,
  tipo: user.role,
  dataCadastro: user.createdAt,
  telefone: user.phone || '(00) 0000-0000',
  departamento: user.department || 'Não informado'
});

// Função principal para buscar usuários
async function fetchUsers() {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      showNotification('Sessão expirada. Redirecionando para login...', 'error');
      setTimeout(() => window.location.href = '/index.html', 2000);
      return;
    }

    const url = new URL(API_BASE_URL, window.location.origin);
    const params = {
      search: searchTerm,
      page: currentPage,
      limit: rowsPerPage,
      sort: currentSort.column,
      order: currentSort.direction,
      role: document.getElementById('filter-tipo').value
    };

    Object.entries(params).forEach(([key, value]) => {
      if (value) url.searchParams.append(key, value);
    });

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 401) {
      window.location.href = '/index.html';
      return;
    }

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Erro ao carregar usuários');
    }

    return {
      data: data.data.map(formatUserData),
      pagination: data.pagination
    };
    
  } catch (error) {
    console.error('Erro na requisição:', error);
    showNotification(error.message, 'error');
    return { data: [], pagination: { total: 0 } };
  }
}

// Função para renderizar a tabela
async function renderUsers() {
  try {
    const { data: users, pagination } = await fetchUsers();
    const tableBody = document.getElementById('users-table-body');
    tableBody.innerHTML = '';

    totalUsers = pagination.total;
    
    // Atualizar contadores conforme mock
    const start = (currentPage - 1) * rowsPerPage + 1;
    const end = Math.min(currentPage * rowsPerPage, totalUsers);
    
    document.getElementById('users-count').textContent = `${start}-${end}`;
    document.getElementById('total-users').textContent = totalUsers;

    // Preencher tabela mantendo o layout original
    users.forEach(user => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${user.nome}</td>
        <td>${user.email}</td>
        <td>${user.telefone}</td>
        <td>
          <span class="tag tag-${user.tipo}">
            ${user.tipo === 'admin' ? 'Administrador' : 
              user.tipo === 'perito' ? 'Perito' : 'Assistente'}
          </span>
        </td>
        <td>${user.departamento}</td>
        <td>${formatDate(user.dataCadastro)}</td>
        <td>
          <div class="table-actions">
            <button class="btn-view" onclick="viewUser('${user._id}')" title="Visualizar detalhes">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <button class="btn-edit" onclick="editUser('${user._id}')" title="Editar usuário">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <button class="btn-delete" onclick="deleteUser('${user._id}', '${user.nome}')" title="Excluir usuário">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 6h18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        </td>
      `;
      tableBody.appendChild(row);
    });

    renderPagination();
  } catch (error) {
    console.error('Erro ao renderizar usuários:', error);
  }
}

// Função para ordenação mantendo a interface
async function sortTable(columnIndex) {
  const columnsMapping = {
    0: 'username',
    1: 'email',
    2: 'phone',
    3: 'role',
    4: 'department',
    5: 'createdAt'
  };

  const newColumn = columnsMapping[columnIndex];
  
  if (currentSort.column === newColumn) {
    currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
  } else {
    currentSort.column = newColumn;
    currentSort.direction = 'asc';
  }

  // Atualizar ícones de ordenação
  document.querySelectorAll('th .sort-icon').forEach((icon, index) => {
    icon.textContent = index === columnIndex ? (currentSort.direction === 'asc' ? '▲' : '▼') : '▼';
  });

  await renderUsers();
}

// Restante do código mantido igual...