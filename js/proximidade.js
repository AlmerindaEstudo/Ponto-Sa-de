// Fórmula de Haversine: Calcula a distância em Km entre duas coordenadas
function calcularDistancia(lat1, lon1, lat2, lon2) {
  const R = 6371; // Raio da Terra em km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; 
}

// Função para gerar a lista ordenada
function renderizarListaProximidade(userLat, userLng) {
  const listaContainer = document.getElementById('lista-locais');
  listaContainer.innerHTML = ''; // Limpa a mensagem padrão

  // 1. Mapeia os marcadores calculando a distância
  const locaisComDistancia = marcadoresNoMapa.map(item => {
    const lat = item.marker.getLatLng().lat;
    const lng = item.marker.getLatLng().lng;
    const distancia = calcularDistancia(userLat, userLng, lat, lng);
    
    // Tentamos resgatar o nome do popup, ou usamos um fallback
    const nome = item.marker.getPopup() ? item.marker.getPopup().getContent() : "Local de Saúde";

    return { ...item, distancia, nome };
  });

  // 2. Ordena o array: do menor para o maior (mais próximo primeiro)
  locaisComDistancia.sort((a, b) => a.distancia - b.distancia);

  // 3. Monta o HTML dinamicamente
  locaisComDistancia.forEach(local => {
    const li = document.createElement('li');
    li.className = 'local-item';
    
    // Se for menor que 1km, mostra em metros. Se não, mostra em Km com 1 casa decimal.
    const distFormatada = local.distancia < 1 
      ? `${Math.round(local.distancia * 1000)} m` 
      : `${local.distancia.toFixed(1)} km`;

    // Deixa a primeira letra da categoria maiúscula
    const categoriaCapitalizada = local.tipo.charAt(0).toUpperCase() + local.tipo.slice(1);

    li.innerHTML = `
      <h4>${local.nome}</h4>
      <p>
        <span><i class="bi bi-tag"></i> ${categoriaCapitalizada}</span>
        <span class="distancia-badge"><i class="bi bi-geo-alt"></i> ${distFormatada}</span>
      </p>
    `;

    // 4. O clique no item centraliza o mapa e abre o popup
    li.addEventListener('click', () => {
      fecharSidebar();
      
      map.flyTo(local.marker.getLatLng(), 16);
      local.marker.openPopup();
    });

    listaContainer.appendChild(li);
  });
}

