document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const casoId = params.get('id');
    if (!casoId) return alert('ID de caso não fornecido.');
  
    // Buscar dados do caso
    let caso;
    try {
      const resp = await fetch(`/api/casos/${encodeURIComponent(casoId)}`, { credentials: 'include' });
      if (!resp.ok) throw new Error('Falha ao carregar dados');
      caso = await resp.json();
    } catch (e) {
      return alert('Não foi possível obter os dados do caso.');
    }
  
    // Atualizar datas padrão
    const hoje = new Date();
    document.getElementById('data-atual').textContent = hoje.toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' });
    document.getElementById('dataAssinatura').textContent = hoje.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  
    // Preencher campos básicos
    document.getElementById('laudoPericial').textContent = caso.numeroCaso;
    document.getElementById('numeroBO').textContent = caso.contexto.origemDemanda;
    document.getElementById('boNumero').textContent = caso.contexto.origemDemanda;
    document.getElementById('laudoId').textContent = caso.numeroCaso;
    const dt = new Date(caso.dataAbertura);
    document.getElementById('dataRegistro').textContent = `${dt.toLocaleDateString('pt-BR')} - ${dt.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})}`;
    document.getElementById('tipoCrime').textContent = caso.contexto.tipoCaso;
    const statusEl = document.getElementById('statusCaso');
    statusEl.textContent = caso.status;
    statusEl.classList.add(caso.status.toLowerCase().replace(/\s+/g,'-'));
    document.getElementById('prioridade').textContent = caso.historico[0]?.substatus || 'Não definida';
  
    // Identificação
    document.getElementById('identificado').textContent = caso.dadosIndividuo.nome ? 'Sim' : 'Não';
    document.getElementById('nomeCompleto').textContent = caso.dadosIndividuo.nome || 'Não identificado';
    document.getElementById('sexo').textContent = caso.dadosIndividuo.sexo || 'Não determinado';
    document.getElementById('idade').textContent = caso.dadosIndividuo.idadeEstimado ? caso.dadosIndividuo.idadeEstimado + ' anos (estimado)' : 'Não determinado';
    document.getElementById('identidade').textContent = caso.dadosIndividuo.identificadores || 'Não disponível';
    document.getElementById('etnia').textContent = caso.dadosIndividuo.etnia || 'Não determinada';
    document.getElementById('condicoesCorpo').textContent = caso.contexto.descricao || 'Não informado';
  
    // Achados
    document.getElementById('registrosAnte').textContent = caso.documentacao.registrosAnte || 'Não disponível';
    document.getElementById('registrosPost').textContent = caso.documentacao.registrosPost || 'Não disponível';
    const fotoCont = document.getElementById('fotografiasContainer');
    if (caso.documentacao.fotografias?.length) {
      document.getElementById('fotografias').textContent = `${caso.documentacao.fotografias.length} fotografias disponíveis`;
    } else {
      fotoCont.style.display = 'none';
    }
    document.getElementById('antecedentes').textContent = caso.dadosIndividuo.antecedentes || 'Não disponível';
  
    // Conclusão e responsáveis
    document.getElementById('conclusao').textContent = caso.contexto.descricao || 'Pendente análise final';
    document.getElementById('perito').textContent = caso.responsavel;
    document.getElementById('auxiliar').textContent = caso.cadeiaCustodia?.responsavelColeta || 'Não informado';
    document.getElementById('nomeAssinante').textContent = caso.responsavel;
  
    // Evidências
    const evidSec = document.getElementById('secao-evidencias');
    const tbody = document.getElementById('corpoTabelaEvidencias');
    let hasEv = false;
    const genId = () => { const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${Math.floor(Math.random()*999).toString().padStart(3,'0')}`; };
    const fmt = d => new Date(d).toLocaleDateString('pt-BR', { day:'2-digit', month:'2-digit', year:'numeric' });
    // Antemortem
    if (caso.documentacao.registrosAnte) {
      hasEv=true; addRow('Documento','Prontuário odontológico antemortem', fmt(caso.dataAbertura));
    }
    if (caso.documentacao.registrosPost) {
      hasEv=true; addRow('Documento','Registro odontológico postmortem', fmt(caso.dataAbertura));
    }
    if (caso.documentacao.fotografias?.length) {
      hasEv=true; addRow('Imagem','Fotografias intrabucais - conjunto', fmt(caso.dataAbertura));
    }
    if (caso.cadeiaCustodia?.evidencias) {
      hasEv=true; addRow('Outros', caso.cadeiaCustodia.evidencias, fmt(caso.cadeiaCustodia.dataColeta));
    }
    if (!hasEv) evidSec.style.display='none';
    function addRow(tipo, desc, data) {
      const tr=document.createElement('tr');
      tr.innerHTML=`<td>EV-${genId()}</td><td>${tipo}</td><td>${desc}</td><td>${data}</td>`;
      tbody.appendChild(tr);
    }
  
    // PDF e impressão
    document.getElementById('exportar-pdf').addEventListener('click', () => {
      alert('Preparando PDF, aguarde...');
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF('p','mm','a4');
      html2canvas(document.getElementById('relatorio-para-exportar'), { scale:2, useCORS:true }).then(canvas => {
        const imgData = canvas.toDataURL('image/jpeg',1);
        const imgW=210, pageH=295;
        let imgH=canvas.height * imgW / canvas.width, pos=0;
        doc.addImage(imgData,'JPEG',0,pos,imgW,imgH);
        let rem=imgH-pageH;
        while (rem>0) { pos=-rem; doc.addPage(); doc.addImage(imgData,'JPEG',0,pos,imgW,imgH); rem-=pageH; }
        doc.save(`Relatorio_${caso.numeroCaso}.pdf`);
      });
    });
    document.getElementById('imprimir').addEventListener('click', () => window.print());
  });