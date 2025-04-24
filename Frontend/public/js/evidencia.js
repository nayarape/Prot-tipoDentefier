document.addEventListener('DOMContentLoaded', function() {
    // Atualizar a data atual
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('current-date').textContent = new Date().toLocaleDateString('pt-BR', options);
    
    // Pré-definir a data atual nos campos de data
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('evidence-date').value = today;
    document.getElementById('report-date').value = today;
    
    // Preview da imagem
    const imageInput = document.getElementById('evidence-image');
    const previewImage = document.getElementById('preview-image');
    
    imageInput.addEventListener('change', function() {
      const file = this.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          previewImage.src = e.target.result;
        }
        reader.readAsDataURL(file);
      }
    });
    
    // Botão cancelar
    document.querySelector('.cancel-btn').addEventListener('click', function() {
      if (confirm('Tem certeza que deseja cancelar? Todas as informações não salvas serão perdidas.')) {
        window.location.href = 'auditoria.html';
      }
    });
    
    // Validação e envio do formulário
    document.getElementById('evidence-form').addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Aqui você adicionaria a lógica para enviar os dados para o servidor
      alert('Evidência cadastrada com sucesso!');
      // Redirecionar para a página de evidências após salvar
      // window.location.href = 'auditoria.html';
    });
  });