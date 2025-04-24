// Função para inicializar o mapa do Google
function initMap() {
  // Coordenadas padrão (você pode ajustar para sua localização preferida)
  const defaultLocation = { lat: -15.7801, lng: -47.9292 }; // Brasília, Brasil
  
  // Criar o mapa
  const map = new google.maps.Map(document.getElementById("map"), {
      center: defaultLocation,
      zoom: 15,
      mapTypeControl: false,
  });
  
  // Criar marcador arrastável
  const marker = new google.maps.Marker({
      position: defaultLocation,
      map: map,
      draggable: true,
      title: "Arraste para definir a localização"
  });
  
  // Campo de busca de localização
  const input = document.getElementById("pac-input");
  const searchBox = new google.maps.places.SearchBox(input);
  
  // Centralizar o mapa quando uma localização for selecionada na busca
  searchBox.addListener("places_changed", () => {
      const places = searchBox.getPlaces();
      
      if (places.length === 0) {
          return;
      }
      
      const place = places[0];
      
      if (!place.geometry || !place.geometry.location) {
          console.log("Localização sem geometria retornada");
          return;
      }
      
      // Atualizar marcador e campos de latitude/longitude
      marker.setPosition(place.geometry.location);
      document.getElementById("latitude").value = place.geometry.location.lat();
      document.getElementById("longitude").value = place.geometry.location.lng();
      document.getElementById("enderecoCompleto").value = place.formatted_address;
      
      // Centralizar mapa
      map.setCenter(place.geometry.location);
  });
  
  // Atualizar campos quando o marcador é arrastado
  google.maps.event.addListener(marker, 'dragend', function() {
      const position = marker.getPosition();
      document.getElementById("latitude").value = position.lat();
      document.getElementById("longitude").value = position.lng();
      
      // Obter endereço a partir das coordenadas (geocodificação reversa)
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ 'location': position }, function(results, status) {
          if (status === google.maps.GeocoderStatus.OK) {
              if (results[0]) {
                  document.getElementById("enderecoCompleto").value = results[0].formatted_address;
              }
          }
      });
  });
}