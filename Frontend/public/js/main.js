// public/js/main.js (login)

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  if (!loginForm) return;

  // Se já estiver logado, redireciona direto
  const existingToken = localStorage.getItem('jwtToken');
  const existingUser  = localStorage.getItem('user');
 // if (existingToken && existingUser) {
 //   const user = JSON.parse(existingUser);
 //   if (user.role === 'admin') {
 //     return window.location.href = 'dashboard_admin.html';
 //   } else if (user.role === 'perito') {
 //     return window.location.href = 'dashboard_perito.html';
 //   } else if (user.role === 'assistente') {
 //     return window.location.href = 'dashboard_assistente.html';
 //   }
 // }

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(loginForm);
    const data = {
      username: formData.get('username'),
      password: formData.get('password')
    };

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await response.json();

      if (response.ok) {
        // Salva token e dados do usuário
        localStorage.setItem('jwtToken', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        
        // ADICIONAL: Salvar token também como 'token' para compatibilidade com laudo.js
        localStorage.setItem('token', result.token);

        // Redireciona conforme o perfil
//        if (result.user.role === 'admin') {
//          window.location.href = 'dashboard_admin.html';
//        } else if (result.user.role === 'perito') {
//          window.location.href = 'dashboard_perito.html';
//        } else if (result.user.role === 'assistente') {
//          window.location.href = 'dashboard_assistente.html';
//       } else {
//          // Caso haja outros perfis
//          window.location.href = 'index.html';
//        }
//        }
    } else {
      alert(result.message || 'Erro ao realizar login');
    }
  } catch (error) {
    console.error('Erro no login:', error);
    alert('Falha no login. Tente novamente.');
  }
  }); // Closing brace for loginForm.addEventListener
}); // Closing brace for DOMContentLoaded