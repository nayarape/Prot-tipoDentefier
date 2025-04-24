document.addEventListener('DOMContentLoaded', function() {
  // Referências para elementos da UI
  const progressFill = document.getElementById('progressFill');
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  
  // Botões de navegação
  const nextToDados = document.getElementById('next-to-dados');
  const backToIdentificacao = document.getElementById('back-to-identificacao');
  const nextToColeta = document.getElementById('next-to-coleta');
  const backToDados = document.getElementById('back-to-dados');
  const nextToAchados = document.getElementById('next-to-achados');
  const backToColeta = document.getElementById('back-to-coleta');
  const nextToConclusao = document.getElementById('next-to-conclusao');
  const backToAchados = document.getElementById('back-to-achados');

  // Selects que controlam a exibição de campos adicionais
  const identificadoSelect = document.getElementById('identificadoSelect');
  const tipoCrimeSelect = document.getElementById('tipoCrime');
  const localExameSelect = document.getElementById('localExame');
  const tipoExameOdontologicoSelect = document.getElementById('tipoExameOdontologico');
  const dadosAnterioresSelect = document.getElementById('dadosAnteriores');
  const temEvidenciasFisicasSelect = document.getElementById('temEvidenciasFisicas');

  // Função para atualizar a barra de progresso
  function updateProgress(step) {
      // Cálculo da porcentagem baseado no passo atual (0-4)
      const progressPercentage = (step / 4) * 100;
      progressFill.style.width = progressPercentage + '%';
  }

  // Função para mudar entre abas
  function changeTab(tabIndex) {
      // Remover classes ativas de todas as abas
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
      
      // Adicionar classe ativa à aba selecionada
      tabButtons[tabIndex].classList.add('active');
      tabContents[tabIndex].classList.add('active');
      
      // Atualizar barra de progresso
      updateProgress(tabIndex);
  }

  // Adicionar event listeners aos botões de navegação
  if (nextToDados) {
      nextToDados.addEventListener('click', function() {
          changeTab(1); // Mudar para a aba "Dados do Caso"
      });
  }
  
  if (backToIdentificacao) {
      backToIdentificacao.addEventListener('click', function() {
          changeTab(0); // Voltar para a aba "Identificação"
      });
  }
  
  if (nextToColeta) {
      nextToColeta.addEventListener('click', function() {
          changeTab(2); // Mudar para a aba "Coleta e Procedimentos"
      });
  }
  
  if (backToDados) {
      backToDados.addEventListener('click', function() {
          changeTab(1); // Voltar para a aba "Dados do Caso" 
      });
  }
  
  if (nextToAchados) {
      nextToAchados.addEventListener('click', function() {
          changeTab(3); // Mudar para a aba "Achados e Evidências"
      });
  }
  
  if (backToColeta) {
      backToColeta.addEventListener('click', function() {
          changeTab(2); // Voltar para a aba "Coleta e Procedimentos"
      });
  }
  
  if (nextToConclusao) {
      nextToConclusao.addEventListener('click', function() {
          changeTab(4); // Mudar para a aba "Conclusão"
      });
  }
  
  if (backToAchados) {
      backToAchados.addEventListener('click', function() {
          changeTab(3); // Voltar para a aba "Achados e Evidências"
      });
  }

  // Adicionar event listeners para cliques nas abas
  tabButtons.forEach((button, index) => {
      button.addEventListener('click', function() {
          changeTab(index);
      });
  });

  // Controlar exibição de campos adicionais com base nas seleções
  if (identificadoSelect) {
      identificadoSelect.addEventListener('change', function() {
          const camposIdentificacao = document.getElementById('campos-identificacao');
          if (camposIdentificacao) {
              camposIdentificacao.style.display = this.value === 'sim' ? 'block' : 'none';
          }
      });
  }

  if (tipoCrimeSelect) {
      tipoCrimeSelect.addEventListener('change', function() {
          const outroTipoCrimeContainer = document.getElementById('outroTipoCrimeContainer');
          if (outroTipoCrimeContainer) {
              outroTipoCrimeContainer.style.display = this.value === 'Outros' ? 'block' : 'none';
          }
      });
  }

  if (localExameSelect) {
      localExameSelect.addEventListener('change', function() {
          const outroLocalContainer = document.getElementById('outroLocalContainer');
          if (outroLocalContainer) {
              outroLocalContainer.style.display = this.value === 'Outro' ? 'block' : 'none';
          }
      });
  }

  if (tipoExameOdontologicoSelect) {
      tipoExameOdontologicoSelect.addEventListener('change', function() {
          const outroExameContainer = document.getElementById('outroExameContainer');
          if (outroExameContainer) {
              outroExameContainer.style.display = this.value === 'Outro' ? 'block' : 'none';
          }
      });
  }

  if (dadosAnterioresSelect) {
      dadosAnterioresSelect.addEventListener('change', function() {
          const uploadDadosAnteriores = document.getElementById('uploadDadosAnteriores');
          if (uploadDadosAnteriores) {
              uploadDadosAnteriores.style.display = this.value === 'sim' ? 'block' : 'none';
          }
      });
  }

  if (temEvidenciasFisicasSelect) {
      temEvidenciasFisicasSelect.addEventListener('change', function() {
          const evidenciasFisicasContainer = document.getElementById('evidenciasFisicasContainer');
          if (evidenciasFisicasContainer) {
              evidenciasFisicasContainer.style.display = this.value === 'sim' ? 'block' : 'none';
          }
      });
  }

  // Usar localização atual para o mapa (se disponível)
  const btnLocalizacaoAtual = document.getElementById('btnLocalizacaoAtual');
  if (btnLocalizacaoAtual) {
      btnLocalizacaoAtual.addEventListener('click', function() {
          if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(function(position) {
                  const latitude = position.coords.latitude;
                  const longitude = position.coords.longitude;
                  
                  // Preencher campos de latitude e longitude
                  document.getElementById('latitude').value = latitude;
                  document.getElementById('longitude').value = longitude;
                  
                  // Se existir um mapa carregado, também atualizá-lo
                  // Isso dependerá da implementação completa do mapa
              });
          } else {
              alert('Geolocalização não é suportada pelo seu navegador.');
          }
      });
  }

  // Iniciar com a primeira aba ativa e barra de progresso em 0%
  updateProgress(0);
  
  // Envio do formulário
  const formCasoCompleto = document.getElementById('form-caso-completo');
  if (formCasoCompleto) {
      formCasoCompleto.addEventListener('submit', function(event) {
          event.preventDefault();
          // Aqui você pode adicionar validação do formulário
          
          // Simulação de sucesso
          alert('Caso salvo com sucesso!');
          // Redirecionamento ou outra ação após salvar
          // window.location.href = "gerenciar_casos.html";
      });
  }
});