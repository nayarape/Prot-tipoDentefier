    // Script para mostrar o campo de texto quando "Outros" for selecionado
    document.getElementById('tipoCrime').addEventListener('change', function() {
        const outroTipoCrimeContainer = document.getElementById('outroTipoCrimeContainer');
        const outroTipoCrimeTexto = document.getElementById('outroTipoCrimeTexto');
        
        if (this.value === 'Outros') {
          outroTipoCrimeContainer.style.display = 'block';
          outroTipoCrimeTexto.required = true;
        } else {
          outroTipoCrimeContainer.style.display = 'none';
          outroTipoCrimeTexto.required = false;
        }
      });
      
      // Controlar visibilidade dos campos de identificação
      document.getElementById('identificadoSelect').addEventListener('change', function() {
        const camposIdentificacao = document.getElementById('campos-identificacao');
        const isIdentificado = this.value === 'sim';
        
        // Mostrar ou esconder os campos com base na seleção
        camposIdentificacao.style.display = isIdentificado ? 'block' : 'none';
        
        // Ajuste os campos obrigatórios com base na seleção
        const campos = camposIdentificacao.querySelectorAll('input:not([type="checkbox"]), select, textarea');
        campos.forEach(campo => {
          campo.required = isIdentificado;
        });
      });
      
      // Verificar o valor inicial do select na carga da página
      window.addEventListener('DOMContentLoaded', function() {
        const identificadoSelect = document.getElementById('identificadoSelect');
        const camposIdentificacao = document.getElementById('campos-identificacao');
        
        if (identificadoSelect.value === 'sim') {
          camposIdentificacao.style.display = 'block';
        } else {
          camposIdentificacao.style.display = 'none';
        }
      });

      // 1) Carrega chave da API e insere <script> do Maps + Places
  let map, marker;

  // Carrega a chave da API e insere o script Maps
  fetch('/api/config')
    .then(res => res.json())
    .then(cfg => {
      if (!cfg.googleMapsApiKey || cfg.googleMapsApiKey === "undefined") {
        throw new Error("❌ Chave da API do Google Maps não definida corretamente.");
      }
  
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${cfg.googleMapsApiKey}&callback=initMap&libraries=places`;
      script.async = true;
      script.defer = true;
  
      // Garante que o callback seja chamado após o carregamento
      window.initMap = initMap;
  
      document.head.appendChild(script);
    })
    .catch(err => console.error('❌ Erro ao carregar chave da API:', err));
  
  function initMap() {
    const defaultPos = { lat: -15.7942, lng: -47.8822 }; // Brasília
  
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 12,
      center: defaultPos,
      mapTypeControl: true,
      streetViewControl: false
    });
  
    marker = new google.maps.Marker({
      position: defaultPos,
      map,
      draggable: true,
      title: "Arraste para ajustar!"
    });
  
    // Campo de busca por lugares (Places)
    const input = document.getElementById('pac-input');
    if (input) {
      const searchBox = new google.maps.places.SearchBox(input);
      map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  
      searchBox.addListener('places_changed', () => {
        const places = searchBox.getPlaces();
        if (!places || !places.length) return;
  
        const place = places[0];
        if (!place.geometry) return;
  
        const location = place.geometry.location;
        map.setCenter(location);
        marker.setPosition(location);
        updateFormFields(location);
      });
    } else {
      console.warn("⚠️ Campo #pac-input não encontrado. Campo de busca por local será desativado.");
    }
  
    // Atualiza campos ao mover o marcador
    marker.addListener('dragend', () => updateFormFields(marker.getPosition()));
  
    // Clique no mapa
    map.addListener('click', e => {
      marker.setPosition(e.latLng);
      updateFormFields(e.latLng);
    });
  
    // Geolocalização automática
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        const userPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        marker.setPosition(userPos);
        map.setCenter(userPos);
        updateFormFields(userPos);
      }, err => {
        console.warn('⚠️ Geolocalização negada ou indisponível. Usando posição padrão (Brasília).');
      });
    }
  
    // Botão "Minha Localização"
    const btnLocal = document.getElementById('btnLocalizacaoAtual');
    if (btnLocal) {
      btnLocal.addEventListener('click', () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(pos => {
            const p = { lat: pos.coords.latitude, lng: pos.coords.longitude };
            marker.setPosition(p);
            map.setCenter(p);
            updateFormFields(p);
          }, () => alert('Não foi possível obter sua localização.'));
        } else {
          alert('Geolocalização não suportada neste navegador.');
        }
      });
    }
  }
  
  // Atualiza os campos do formulário e busca endereço no backend
  function updateFormFields(latLng) {
    const lat = typeof latLng.lat === 'function' ? latLng.lat() : latLng.lat;
    const lng = typeof latLng.lng === 'function' ? latLng.lng() : latLng.lng;
  
    document.getElementById('latitude').value = lat.toFixed(6);
    document.getElementById('longitude').value = lng.toFixed(6);
  
    fetch(`/api/geocode?lat=${lat}&lng=${lng}`)
      .then(res => res.json())
      .then(data => {
        if (data.results && data.results[0]) {
          const addr = data.results[0].formatted_address;
          document.getElementById('enderecoCompleto').value = addr;
        }
      })
      .catch(err => console.error('❌ Erro na geocodificação:', err));
  }