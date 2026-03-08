// Inicializa o Mapa - Centralizado em Itapetinga, BA
const map = L.map('map').setView([-15.2494436, -40.2449], 13);

// OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);

// Função dinâmica para gerar os ícones do mapa com ou sem destaque de edição
function gerarIconeMarcador(tipo, isEditable = false) {
  let iconClass = '';
  let iconBi = '';

  if (tipo === 'hospital') { 
    iconClass = 'map-icon-hospital'; 
    iconBi = 'bi-hospital'; 
  }
  else if (tipo === 'posto') { 
    iconClass = 'map-icon-posto'; 
    iconBi = 'bi-buildings'; 
  }
  else if (tipo === 'upa') { 
    iconClass = 'map-icon-upa'; 
    iconBi = 'bi-building'; 
  }
  else if (tipo === 'farmacia') { 
    iconClass = 'map-icon-farmacia'; 
    iconBi = 'bi bi-shop-window'; 
  }

  const extraClass = isEditable ? ' marker-editable-ring' : '';
  const starBadge = isEditable ? '<div class="marker-star-badge"><i class="bi bi-star-fill"></i></div>' : '';

  return L.divIcon({
    className: '',
    iconSize: [60, 60],
    iconAnchor: [30, 30],
    popupAnchor: [0, -30],
    html: `
      <div class="${iconClass}${extraClass}" style="position: relative;">
        ${starBadge}
        <i class="bi ${iconBi}"></i>
      </div>
    `
  });
}

function offsetLatLng(lat, lng, offset = 0.00015) {
  return [
    lat + (Math.random() - 0.5) * offset,
    lng + (Math.random() - 0.5) * offset
  ];
}

