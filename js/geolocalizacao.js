// --- LÓGICA DE GEOLOCALIZAÇÃO ---

const btnLocation = document.getElementById('btn-location');
let userMarker = null; // Variável para guardar o marcador do usuário

btnLocation.addEventListener('click', () => {
  // 1. Verifica se o navegador suporta geolocalização
  if (!navigator.geolocation) {
    alert("Infelizmente, seu navegador não suporta geolocalização.");
    return;
  }

  // Muda o texto do botão temporariamente para dar feedback de carregamento
  const originalText = btnLocation.innerHTML;
  btnLocation.innerHTML = '<i class="bi bi-hourglass-split"></i> Buscando...';

  // 2. Solicita a localização
  navigator.geolocation.getCurrentPosition(
    (position) => {
      // Sucesso: pega as coordenadas
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      // 3. Centralizar o mapa na localização atual
      map.flyTo([lat, lng], 15);

      // 4. Exibir indicador visual da posição do usuário
      if (userMarker) {
        // Se o marcador já existe, apenas movemos ele
        userMarker.setLatLng([lat, lng]);
      } else {
        // Se não existe, criamos um ícone customizado com as classes no CSS
        const userIcon = L.divIcon({
          className: '',
          iconSize: [42, 42],
          iconAnchor: [21, 21],
          popupAnchor: [0, -21],
          html: `
            <div class="icon-box blue" style="border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3); border-radius: 50%;">
              <i class="bi bi-person-fill"></i>
            </div>
          `
        });
        
        userMarker = L.marker([lat, lng], { icon: userIcon })
          .addTo(map)
          .bindPopup('<b>Você está aqui!</b>')
          .openPopup();
      }

      renderizarListaProximidade(lat, lng);

      // Restaura o botão
      btnLocation.innerHTML = originalText;
    },
    (error) => {
      // 5. Exibir mensagens claras em caso de erro
      btnLocation.innerHTML = originalText; // Restaura o botão
      
      switch(error.code) {
        case error.PERMISSION_DENIED:
          alert("Permissão negada. Para ver os locais próximos, por favor libere o acesso à localização nas configurações do seu navegador.");
          break;
        case error.POSITION_UNAVAILABLE:
          alert("A informação da sua localização está indisponível no momento.");
          break;
        case error.TIMEOUT:
          alert("O tempo para buscar sua localização esgotou. Tente novamente.");
          break;
        default:
          alert("Ocorreu um erro desconhecido ao tentar buscar sua localização.");
          break;
      }
    },
    {
      enableHighAccuracy: true, // Tenta usar o GPS se disponível
      timeout: 10000,           // Espera até 10 segundos
      maximumAge: 0             // Não usa localização em cache
    }
  );
});

