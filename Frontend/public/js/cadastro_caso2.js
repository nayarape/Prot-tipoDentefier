    // Script para mostrar campo de texto quando "Outro" for selecionado no local de exame
    document.querySelector('select[name="localExame"]').addEventListener('change', function() {
        const outroLocalContainer = document.getElementById('outroLocalContainer');
        const outroLocalTexto = document.getElementById('outroLocalTexto');
        
        if (this.value === 'Outro') {
          outroLocalContainer.style.display = 'block';
          outroLocalTexto.required = true;
        } else {
          outroLocalContainer.style.display = 'none';
          outroLocalTexto.required = false;
        }
      });
      
      // Script para mostrar campo de texto quando "Outro" for selecionado no tipo de exame
      document.querySelector('select[name="tipoExameOdontologico"]').addEventListener('change', function() {
        const outroExameContainer = document.getElementById('outroExameContainer');
        const outroExameTexto = document.getElementById('outroExameTexto');
        
        if (this.value === 'Outro') {
          outroExameContainer.style.display = 'block';
          outroExameTexto.required = true;
        } else {
          outroExameContainer.style.display = 'none';
          outroExameTexto.required = false;
        }
      });
      
      // Script para mostrar campo de upload quando "Sim" for selecionado em dados odontológicos anteriores
      document.querySelector('select[name="dadosAnteriores"]').addEventListener('change', function() {
        const uploadDadosAnteriores = document.getElementById('uploadDadosAnteriores');
        
        if (this.value === 'sim') {
          uploadDadosAnteriores.style.display = 'block';
        } else {
          uploadDadosAnteriores.style.display = 'none';
        }
      });
      
      // Verificar seleções iniciais quando a página é carregada
      window.addEventListener('DOMContentLoaded', function() {
        // Verificar local de exame
        const localExame = document.querySelector('select[name="localExame"]');
        if (localExame.value === 'Outro') {
          document.getElementById('outroLocalContainer').style.display = 'block';
        }
        
        // Verificar tipo de exame
        const tipoExame = document.querySelector('select[name="tipoExameOdontologico"]');
        if (tipoExame.value === 'Outro') {
          document.getElementById('outroExameContainer').style.display = 'block';
        }
        
        // Verificar dados anteriores
        const dadosAnteriores = document.querySelector('select[name="dadosAnteriores"]');
        if (dadosAnteriores.value === 'sim') {
          document.getElementById('uploadDadosAnteriores').style.display = 'block';
        }
      });
      
      // Tratamento para envio do formulário
      document.getElementById('form-detalhes').addEventListener('submit', function(e) {
        e.preventDefault();
        // Aqui você adicionaria o código para salvar os dados do formulário
        alert('Detalhes salvos com sucesso!');
      });
      
      // Funcionalidade para o anexo de evidências
      document.addEventListener('DOMContentLoaded', function() {
        const evidenciasUpload = document.getElementById('evidenciasUpload');
        const adicionarEvidencias = document.getElementById('adicionarEvidencias');
        const galeriaEvidencias = document.getElementById('galeriaEvidencias');
        const modal = document.getElementById('imageModal');
        const modalImg = document.getElementById('modalImage');
        const modalCaption = document.getElementById('modalCaption');
        const closeModal = document.querySelector('.close-modal');
        
        // Contador para gerar IDs únicos para as imagens
        let evidenceCounter = 0;
        
        // Abrir modal ao clicar em uma imagem
        function openModal(img, alt) {
          modal.style.display = "block";
          modalImg.src = img;
          modalCaption.innerHTML = alt || "Evidência do caso";
        }
        
        // Fechar modal ao clicar no X
        closeModal.onclick = function() {
          modal.style.display = "none";
        }
        
        // Fechar modal ao clicar fora da imagem
        window.onclick = function(event) {
          if (event.target == modal) {
            modal.style.display = "none";
          }
        }
        
        // Adicionar evidências à galeria
        adicionarEvidencias.addEventListener('click', function() {
          const files = evidenciasUpload.files;
          
          if (files.length === 0) {
            alert('Por favor, selecione pelo menos uma imagem para adicionar.');
            return;
          }
          
          // Remover mensagem "Nenhuma evidência adicionada" se existir
          const noEvidence = galeriaEvidencias.querySelector('.no-evidence');
          if (noEvidence) {
            noEvidence.remove();
          }
          
          // Processar cada arquivo selecionado
          for (let i = 0; i < files.length; i++) {
            const file = files[i];
            
            // Verificar se o arquivo é uma imagem
            if (!file.type.match('image.*')) {
              continue;
            }
            
            const reader = new FileReader();
            
            reader.onload = (function(theFile) {
              return function(e) {
                // Gerar ID único para esta evidência
                const evidenceId = 'evidence-' + evidenceCounter++;
                
                // Criar elemento de galeria
                const evidenceItem = document.createElement('div');
                evidenceItem.className = 'evidence-item';
                evidenceItem.id = evidenceId;
                
                // Criar imagem
                const img = document.createElement('img');
                img.className = 'evidence-img';
                img.src = e.target.result;
                img.alt = theFile.name;
                img.addEventListener('click', function() {
                  openModal(this.src, this.alt);
                });
                
                // Criar botão de exclusão
                const deleteBtn = document.createElement('div');
                deleteBtn.className = 'evidence-delete';
                deleteBtn.textContent = 'x';
                deleteBtn.addEventListener('click', function(event) {
                  event.stopPropagation(); // Evitar que o clique propague para a imagem
                  document.getElementById(evidenceId).remove();
                  
                  // Se não houver mais evidências, mostrar a mensagem novamente
                  if (galeriaEvidencias.children.length === 0) {
                    const noEvidence = document.createElement('p');
                    noEvidence.className = 'no-evidence';
                    noEvidence.textContent = 'Nenhuma evidência adicionada.';
                    galeriaEvidencias.appendChild(noEvidence);
                  }
                });
                
                // Adicionar elementos à galeria
                evidenceItem.appendChild(img);
                evidenceItem.appendChild(deleteBtn);
                galeriaEvidencias.appendChild(evidenceItem);
              };
            })(file);
            
            // Ler o arquivo como URL de dados
            reader.readAsDataURL(file);
          }
          
          // Limpar o input de upload para permitir adicionar os mesmos arquivos novamente se necessário
          evidenciasUpload.value = '';
        });
      });