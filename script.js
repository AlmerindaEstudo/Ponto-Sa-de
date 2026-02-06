// Inicializa o mapa
const map = L.map('map').setView([-14.8615, -40.8442], 13);

// OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);

const hospitalIcon = L.divIcon({
  className: '',
  iconSize: [54, 54],
  iconAnchor: [27, 27],
  popupAnchor: [0, -27],
  html: `
    <div class="map-icon-hospital">
      <i class="bi bi-hospital"></i>
    </div>
  `
});

const postoIcon = L.divIcon({
  className: '',
  iconSize: [54, 54],
  iconAnchor: [27, 27],
  popupAnchor: [0, -27],
  html: `
    <div class="map-icon-posto">
      <i class="bi bi-buildings"></i>
    </div>
  `
});

const upaIcon = L.divIcon({
  className: '',
  iconSize: [54, 54],
  iconAnchor: [27, 27],
  popupAnchor: [0, -27],
  html: `
    <div class="map-icon-upa">
      <i class="bi bi-building"></i>
    </div>
  `
});
function offsetLatLng(lat, lng, offset = 0.00015) {
  return [
    lat + (Math.random() - 0.5) * offset,
    lng + (Math.random() - 0.5) * offset
  ];
}


L.marker([-14.8620, -40.8450], { icon: hospitalIcon })
  .addTo(map)
  .bindPopup('Hospital Central');

L.marker([-14.8583, -40.8422], { icon: postoIcon })
  .addTo(map)
  .bindPopup('Posto de Saúde');

L.marker([-14.8654, -40.8484], { icon: postoIcon })
  .addTo(map)
  .bindPopup('Posto Municipal');

L.marker([-14.8706, -40.8403], { icon: upaIcon })
  .addTo(map)
  .bindPopup('UPA 24h');
