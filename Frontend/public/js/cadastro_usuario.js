    // Função para mostrar campos específicos baseados no tipo de usuário selecionado
    function mostrarCamposEspecificos() {
        const tipoUsuario = document.getElementById('tipo_usuario').value;
        
        // Esconde todos os campos específicos primeiro
        document.getElementById('campos-admin').style.display = 'none';
        document.getElementById('campos-perito').style.display = 'none';
        document.getElementById('campos-assistente').style.display = 'none';
        
        // Mostra os campos correspondentes ao tipo selecionado
        if (tipoUsuario === 'admin') {
          document.getElementById('campos-admin').style.display = 'block';
        } else if (tipoUsuario === 'perito') {
          document.getElementById('campos-perito').style.display = 'block';
        } else if (tipoUsuario === 'assistente') {
          document.getElementById('campos-assistente').style.display = 'block';
        }
      }
      
      // Atualizar a data atual
      document.addEventListener('DOMContentLoaded', function() {
        const dataAtual = new Date();
        const opcoes = { day: 'numeric', month: 'long', year: 'numeric' };
        document.getElementById('current-date').textContent = dataAtual.toLocaleDateString('pt-BR', opcoes);
      });
      
      // Prevenindo o envio do formulário para demonstração
      document.getElementById('user-form').addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Usuário cadastrado com sucesso!');
        // Aqui você adicionaria a lógica para enviar o formulário para o backend
      });