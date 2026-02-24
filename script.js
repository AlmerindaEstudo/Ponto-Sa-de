// Inicializa o mapa
const map = L.map('map').setView([-15.2508147, -40.2477774], 13);

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

// --- LOCAIS NO MAPA ---

// 1. Array com os dados (Mokado)
const locaisDeSaude = [
  { tipo: 'hospital', nome: 'Hospital Central', lat: -15.2494436, lng: -40.2564959 },
  { tipo: 'posto', nome: 'Posto de Saúde', lat: -15.2490134, lng: -40.2680764 },
  { tipo: 'posto', nome: 'Posto Municipal', lat: -15.255874, lng: -40.2419739 }, 
  { tipo: 'upa', nome: 'UPA 24h', lat: -15.2541251, lng: -40.2387767 }
];

// 2. Array para guardar os marcadores reais do Leaflet
const marcadoresNoMapa = [];

// 3. Renderiza os marcadores
locaisDeSaude.forEach(local => {
  let iconeEscolhido;
  
  if (local.tipo === 'hospital') iconeEscolhido = hospitalIcon;
  else if (local.tipo === 'posto') iconeEscolhido = postoIcon;
  else if (local.tipo === 'upa') iconeEscolhido = upaIcon;

  const marker = L.marker([local.lat, local.lng], { icon: iconeEscolhido })
    .bindPopup(local.nome)
    .addTo(map);
    
  // Guarda a referência do marcador e o tipo para usar na contagem
  marcadoresNoMapa.push({ tipo: local.tipo, marker: marker });
});

// --- LÓGICA DE CONTAGEM ---

function atualizarContadoresTotais() {
  let contagemHospital = 0;
  let contagemPosto = 0;
  let contagemUpa = 0;

  // Percorre a lista de locais e soma as quantidades totais
  locaisDeSaude.forEach(local => {
    if (local.tipo === 'hospital') contagemHospital++;
    else if (local.tipo === 'posto') contagemPosto++;
    else if (local.tipo === 'upa') contagemUpa++;
  });

  // Atualiza os números no HTML
  document.getElementById('count-hospital').innerText = contagemHospital;
  document.getElementById('count-posto').innerText = contagemPosto;
  document.getElementById('count-upa').innerText = contagemUpa;
}

// Chama a função quando a página carrega
atualizarContadoresTotais();


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

// --- LÓGICA DE FILTROS POR CATEGORIA ---

// Selecionamos apenas os botões que possuem o atributo data-filter
const botoesFiltro = document.querySelectorAll('.filters button[data-filter]');

botoesFiltro.forEach(botao => {
  botao.addEventListener('click', () => {
    
    // 1. Resposta Visual
    // Removemos a classe 'active' de todos os botões de filtro
    botoesFiltro.forEach(b => b.classList.remove('active'));
    // Adicionamos a classe 'active' apenas no botão que acabou de ser clicado
    botao.classList.add('active');

    // 2. Lógica de Atualização do Mapa
    // Pegamos qual é a categoria que o usuário quer ver (ex: 'hospital', 'posto')
    const categoriaSelecionada = botao.getAttribute('data-filter');

    // Percorremos nosso array de marcadores para decidir quem fica e quem sai
    marcadoresNoMapa.forEach(item => {
      // Regra: Mostrar se o filtro for 'todos' OU se o tipo do marcador for igual ao filtro
      if (categoriaSelecionada === 'todos' || item.tipo === categoriaSelecionada) {
        // Se o marcador NÃO estiver no mapa, nós o adicionamos
        if (!map.hasLayer(item.marker)) {
          map.addLayer(item.marker);
        }
      } else {
        // Se não corresponder ao filtro, removemos o marcador da tela
        if (map.hasLayer(item.marker)) {
          map.removeLayer(item.marker);
        }
      }
    });
    
  });
});