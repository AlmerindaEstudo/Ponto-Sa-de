// Inicializa o Mapa
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
  { tipo: 'posto', nome: 'Posto Municipal', lat: -15.244874, lng: -40.2279739 }, 
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

// --- LÓGICA DA LISTA LATERAL E DISTÂNCIA ---

// Elementos da interface
const sidebar = document.getElementById('sidebar-locais');
const btnToggleList = document.getElementById('btn-toggle-list');
const btnCloseList = document.getElementById('btn-close-list');
const overlay = document.getElementById('overlay'); // Captura a película

// Função centralizada para abrir
function abrirSidebar() {
  sidebar.classList.add('open');
  overlay.classList.add('active');      
  btnToggleList.classList.add('active-btn');
}

// Função centralizada para fechar
function fecharSidebar() {
  sidebar.classList.remove('open');
  overlay.classList.remove('active');      
  btnToggleList.classList.remove('active-btn');
}

// Eventos de clique
btnToggleList.addEventListener('click', abrirSidebar);
btnCloseList.addEventListener('click', fecharSidebar);

// Se o usuário clicar na parte escura da tela, também fecha a aba!
overlay.addEventListener('click', fecharSidebar);

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

// --- LÓGICA DE AUTENTICAÇÃO E MODAL DE LOGIN ---

const btnAbrirLogin = document.getElementById('btn-login-colaborador');
const loginOverlay = document.getElementById('login-overlay');
const btnFecharLogin = document.getElementById('btn-close-login');
const formLogin = document.getElementById('form-login');

// Elementos dos campos e erros
const inputEmail = document.getElementById('email');
const inputSenha = document.getElementById('senha');
const erroEmail = document.getElementById('erro-email');
const erroSenha = document.getElementById('erro-senha');
const msgServidor = document.getElementById('mensagem-servidor');

// 1. Funções de abrir e fechar o modal
function abrirModalLogin() {
  loginOverlay.classList.add('open');
}

function fecharModalLogin() {
  loginOverlay.classList.remove('open');
  formLogin.reset(); // Limpa os campos
  limparErros();     // Limpa os alertas visuais
}

btnAbrirLogin.addEventListener('click', abrirModalLogin);
btnFecharLogin.addEventListener('click', fecharModalLogin);

// Fecha clicando fora da caixinha branca
loginOverlay.addEventListener('click', (e) => {
  if(e.target === loginOverlay) fecharModalLogin();
});

// 2. Função para resetar o visual de erro
function limparErros() {
  inputEmail.classList.remove('input-error');
  inputSenha.classList.remove('input-error');
  erroEmail.textContent = '';
  erroSenha.textContent = '';
  msgServidor.textContent = '';
  msgServidor.className = 'mensagem-servidor'; // reseta as classes de cor
}

// 3. Interceptação e Validação do Formulário
formLogin.addEventListener('submit', (e) => {
  e.preventDefault(); // Impede a página de recarregar!
  limparErros();      // Limpa erros antigos antes de validar de novo

  const email = inputEmail.value.trim();
  const senha = inputSenha.value.trim();
  let temErro = false;

  // Validação do E-mail
  if (!email) {
    inputEmail.classList.add('input-error');
    erroEmail.textContent = 'O e-mail é obrigatório.';
    temErro = true;
  } else if (!email.includes('@') || !email.includes('.')) {
    inputEmail.classList.add('input-error');
    erroEmail.textContent = 'Digite um formato de e-mail válido.';
    temErro = true;
  }

  // Validação da Senha
  if (!senha) {
    inputSenha.classList.add('input-error');
    erroSenha.textContent = 'A senha é obrigatória.';
    temErro = true;
  } else if (senha.length < 6) {
    inputSenha.classList.add('input-error');
    erroSenha.textContent = 'A senha deve ter no mínimo 6 caracteres.';
    temErro = true;
  }

  // Se o Front-End achou erro, a função para aqui e nem chama o Back-End
  if (temErro) return;

  // 4. Mock de Autenticação (Simulando o Back-End Django)
  // Vamos definir que o usuário correto é: admin@saudemap.com / 123456
  
  if (email === 'admin@saudemap.com' && senha === '123456') {
    msgServidor.textContent = 'Login realizado com sucesso! Redirecionando...';
    msgServidor.classList.add('msg-success');
    
    // Simula um tempo de carregamento e muda o estado do botão lá no cabeçalho
    setTimeout(() => {
      fecharModalLogin();
      btnAbrirLogin.innerHTML = '<i class="bi bi-person-check-fill"></i> Painel do Colaborador';
      btnAbrirLogin.style.background = '#198754'; // Fica verde
      btnAbrirLogin.style.color = 'white';
    }, 1500);

  } else {
    msgServidor.textContent = 'Credenciais incorretas. Tente novamente.';
    msgServidor.classList.add('msg-error');
    inputEmail.classList.add('input-error');
    inputSenha.classList.add('input-error');
  }
});