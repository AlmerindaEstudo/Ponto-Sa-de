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

  if (tipo === 'hospital') { iconClass = 'map-icon-hospital'; iconBi = 'bi-hospital'; }
  else if (tipo === 'posto') { iconClass = 'map-icon-posto'; iconBi = 'bi-buildings'; }
  else if (tipo === 'upa') { iconClass = 'map-icon-upa'; iconBi = 'bi-building'; }

  // Se for editável, adiciona as classes que criamos no CSS (anel amarelo e estrela)
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

// --- LOCAIS NO MAPA ---

// 1. Array base com os dados de Itapetinga, BA
const locaisDeSaudeBase = [
  // HOSPITAIS
  {
    id: 1,
    tipo: 'hospital',
    nome: 'Hospital Cristo Redentor',
    lat: -15.2494436,
    lng: -40.253921,
    endereco: 'Av. Cinquentenário, 560 - Itapetinga, BA',
    telefone: '(77) 3262-3261',
    horario: '24 horas',
    medicos: [
      { nome: 'Equipe Médica Emergencial', especialidade: 'Emergência', horario: '24 horas' },
      { nome: 'Equipe de Clínica Geral', especialidade: 'Clínica Geral', horario: '24 horas' }
    ],
    vacinas: [
      { nome: 'COVID 19', disponvel: true },
      { nome: 'Gripe (Influenza)', disponvel: true }
    ]
  },
  {
    id: 2,
    tipo: 'hospital',
    nome: 'Hospital Municipal Virgínia Hagge',
    lat: -15.2463817,
    lng: -40.2489698,
    endereco: 'R. Itambé - Itapetinga, BA',
    telefone: '(77) 3261-1000',
    horario: '24 horas',
    medicos: [
      { nome: 'Equipe Médica Municipal', especialidade: 'Emergência', horario: '24 horas' },
      { nome: 'Equipe de Pediatria', especialidade: 'Pediatria', horario: '07h-19h' }
    ],
    vacinas: [
      { nome: 'COVID 19', disponvel: true },
      { nome: 'Gripe (Influenza)', disponvel: true },
      { nome: 'Hepatite B', disponvel: true }
    ]
  },
  
  // UPA
  {
    id: 4,
    tipo: 'upa',
    nome: 'UPA 24 Horas',
    lat: -15.2541251,
    lng: -40.2341633,
    endereco: 'Av. Gerson de Oliveira, S/N - Nova Itapetinga, Itapetinga, BA',
    telefone: '(77) 3261-3636',
    horario: '24 horas',
    medicos: [
      { nome: 'Dr. Pedro Henrique Almeida', especialidade: 'Emergencial', horario: '24 horas' },
      { nome: 'Dra. Juliana Rodrigues', especialidade: 'Clínico Geral', horario: '24 horas' },
      { nome: 'Dr. Roberto Carlos Santos', especialidade: 'Cirurgião', horario: 'Seg-Dom 7h-19h' }
    ],
    vacinas: [
      { nome: 'COVID 19', disponvel: true },
      { nome: 'Gripe (Influenza)', disponvel: true },
      { nome: 'DTP (Difteria, Tétano, Coqueluche)', disponvel: true }
    ]
  },
  
  // POSTOS DE SAÚDE (UBS/USF) - COORDENADAS EXATAS INFORMADAS
  {
    id: 5,
    tipo: 'posto',
    nome: 'USF Orfísia Andrade (USF 08)',
    lat: -15.241230,
    lng: -40.235691,
    endereco: 'Rua Antônio Riachão, São Francisco - Itapetinga, BA',
    telefone: '(77) 3261-8764',
    horario: '07h-17h',
    medicos: [
      { nome: 'Equipe de Saúde da Família', especialidade: 'Clínico Geral', horario: '07h-17h' }
    ],
    vacinas: [
      { nome: 'COVID 19', disponvel: true },
      { nome: 'Gripe (Influenza)', disponvel: true }
    ]
  },
  {
    id: 6,
    tipo: 'posto',
    nome: 'USF Clodoaldo Costa',
    lat: -15.258193,
    lng: -40.245568,
    endereco: 'Rua Samuel Dias, s/n, Clodoaldo Costa - Itapetinga, BA',
    telefone: '(77) 3261-8700',
    horario: '08h-17h',
    medicos: [
      { nome: 'Equipe de Saúde da Família', especialidade: 'Clínico Geral', horario: '08h-17h' }
    ],
    vacinas: [
      { nome: 'COVID 19', disponvel: true },
      { nome: 'Hepatite B', disponvel: true }
    ]
  },
  {
    id: 7,
    tipo: 'posto',
    nome: 'UBS Roberto Santos / Nova Itapetinga',
    lat: -15.253943,
    lng: -40.240290,
    endereco: 'Praça José Luna, s/n, Nova Itapetinga - Itapetinga, BA',
    telefone: '(77) 3261-8800',
    horario: '07h-17h',
    medicos: [
      { nome: 'Equipe de Saúde da Família', especialidade: 'Clínico Geral', horario: '07h-17h' }
    ],
    vacinas: [
      { nome: 'COVID 19', disponvel: true },
      { nome: 'Tríplice Viral (Sarampo, Caxumba, Rubéola)', disponvel: true }
    ]
  },
  {
    id: 8,
    tipo: 'posto',
    nome: 'USF Arnaldo Teixeira (USF 14)',
    lat: -15.249000,
    lng: -40.248000,
    endereco: 'Residencial 12 de Dezembro (Vila Érica) - Itapetinga, BA',
    telefone: '(77) 3261-4750',
    horario: '07h-17h',
    medicos: [
      { nome: 'Equipe de Saúde da Família', especialidade: 'Clínico Geral', horario: '07h-17h' }
    ],
    vacinas: [
      { nome: 'COVID 19', disponvel: true },
      { nome: 'Pentavalente', disponvel: true }
    ]
  },
  {
    id: 9,
    tipo: 'posto',
    nome: 'USF Idalécio Andrade (USF 01)',
    lat: -15.249800,
    lng: -40.263500,
    endereco: 'Av. Álvaro Nascimento, s/n, Américo Nogueira - Itapetinga, BA',
    telefone: '(77) 3261-4900',
    horario: '07h-17h',
    medicos: [
      { nome: 'Equipe de Saúde da Família', especialidade: 'Clínico Geral', horario: '07h-17h' }
    ],
    vacinas: [
      { nome: 'COVID 19', disponvel: true },
      { nome: 'Pneumocócica', disponvel: true }
    ]
  },
  {
    id: 10,
    tipo: 'posto',
    nome: 'Centro de Saúde Guilherme Dias',
    lat: -15.254300,
    lng: -40.247100,
    endereco: 'Praça João Barreto, s/n, Camacã - Itapetinga, BA',
    telefone: '(77) 3261-4600',
    horario: '07h-17h',
    medicos: [
      { nome: 'Equipe de Saúde da Família', especialidade: 'Clínico Geral', horario: '07h-17h' }
    ],
    vacinas: [
      { nome: 'COVID 19', disponvel: true },
      { nome: 'Gripe (Influenza)', disponvel: true }
    ]
  }
];

function normalizarNomeLocal(nome) {
  return nome
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\b(usf|ubs|psf|posto|unidade|saude|da|de|do|dos|das|dr|dra|doutor|doutora)\b/g, ' ')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function distanciaEmMetros(lat1, lng1, lat2, lng2) {
  const r = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return r * c;
}

function saoAliasesProximos(localA, localB) {
  if (localA.tipo !== localB.tipo) return false;

  const nomeA = normalizarNomeLocal(localA.nome);
  const nomeB = normalizarNomeLocal(localB.nome);
  const proximidade = distanciaEmMetros(localA.lat, localA.lng, localB.lat, localB.lng);

  const tokensA = nomeA.split(' ').filter(Boolean);
  const tokensB = nomeB.split(' ').filter(Boolean);
  const intersecao = tokensA.filter(token => tokensB.includes(token));

  const nomesMuitoParecidos =
    nomeA === nomeB ||
    nomeA.includes(nomeB) ||
    nomeB.includes(nomeA) ||
    intersecao.length >= 2;

  return nomesMuitoParecidos && proximidade <= 350;
}

function ordenarPorPrioridade(localA, localB) {
  const prioridadeNome = (local) => {
    const nome = local.nome.toLowerCase();
    if (nome.includes('usf')) return 3;
    if (nome.includes('ubs')) return 2;
    if (nome.includes('psf')) return 2;
    if (nome.includes('posto')) return 1;
    return 0;
  };

  return prioridadeNome(localB) - prioridadeNome(localA);
}

function removerDuplicidadesLocais(lista) {
  const resultado = [];

  lista.forEach((localAtual) => {
    const indiceDuplicado = resultado.findIndex(localSalvo => saoAliasesProximos(localSalvo, localAtual));

    if (indiceDuplicado === -1) {
      resultado.push(localAtual);
      return;
    }

    const candidatoA = resultado[indiceDuplicado];
    const candidatoB = localAtual;
    const [melhor] = [candidatoA, candidatoB].sort(ordenarPorPrioridade);
    resultado[indiceDuplicado] = melhor;
  });

  return resultado.map((local, index) => ({ ...local, id: index + 1 }));
}

const STORAGE_LOCAIS_EDITADOS = 'ponto_saude_locais_editados_v1';

function carregarLocaisPersistidos(listaPadrao) {
  try {
    const dados = localStorage.getItem(STORAGE_LOCAIS_EDITADOS);
    if (!dados) return listaPadrao;

    const listaEditada = JSON.parse(dados);
    if (!Array.isArray(listaEditada)) return listaPadrao;

    const porId = new Map(listaEditada.map(item => [item.id, item]));

    return listaPadrao.map((local) => {
      const localEditado = porId.get(local.id);
      if (!localEditado) return local;

      return {
        ...local,
        telefone: localEditado.telefone ?? local.telefone,
        medicos: Array.isArray(localEditado.medicos) ? localEditado.medicos : local.medicos,
        vacinas: Array.isArray(localEditado.vacinas) ? localEditado.vacinas : local.vacinas
      };
    });
  } catch (error) {
    console.warn('Não foi possível carregar edições salvas:', error);
    return listaPadrao;
  }
}

function salvarLocaisPersistidos() {
  try {
    const dadosParaSalvar = locaisDeSaude.map(local => ({
      id: local.id,
      telefone: local.telefone,
      medicos: local.medicos,
      vacinas: local.vacinas
    }));

    localStorage.setItem(STORAGE_LOCAIS_EDITADOS, JSON.stringify(dadosParaSalvar));
  } catch (error) {
    console.warn('Não foi possível salvar edições:', error);
  }
}

const locaisDeSaude = carregarLocaisPersistidos(removerDuplicidadesLocais(locaisDeSaudeBase));

// 2. Array para guardar os marcadores reais do Leaflet
const marcadoresNoMapa = [];
let usuarioLogado = null; // Agora guarda o objeto do usuário logado
let localDetalheAtualId = null;

// Mock simulando as tabelas do Banco de Dados Django
const listaColaboradores = [
  {
    nome: 'João (Hospital Cristo Redentor)',
    email: 'joao@saudemap.com',
    senha: 'colab123',
    localVinculadoId: 1 // Este ID corresponde ao Hospital Cristo Redentor no seu array base
  },
  {
    nome: 'Maria (UPA 24h)',
    email: 'maria@saudemap.com',
    senha: 'colab123',
    localVinculadoId: 4 // Este ID corresponde à UPA 24 Horas
  }
];

// 3. Renderiza os marcadores
locaisDeSaude.forEach(local => {
  const iconeEscolhido = gerarIconeMarcador(local.tipo, false);

  const marker = L.marker([local.lat, local.lng], { icon: iconeEscolhido })
    .bindPopup(local.nome)
    .addTo(map);

  // Evento de clique no popup para abrir os detalhes
  marker.on('click', () => {
    abrirDetalhesLocal(local);
  });
    
  // Guarda a referência do marcador e o tipo para usar na contagem
  marcadoresNoMapa.push({ id: local.id, tipo: local.tipo, marker: marker });
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

// --- LÓGICA DE ABERTURA DE DETALHES DO LOCAL ---

function obterTipoBadge(tipo) {
  const tipos = {
    hospital: { nome: 'Hospital', icon: 'bi-hospital', classe: 'red' },
    posto: { nome: 'Posto de Saúde', icon: 'bi-buildings', classe: 'blue' },
    upa: { nome: 'UPA', icon: 'bi-building', classe: 'orange' }
  };
  return tipos[tipo] || { nome: 'Local de Saúde', icon: 'bi-geo-alt', classe: 'orange' };
}

function escaparValorInput(valor) {
  return String(valor ?? '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function linhaMedicoHtml(medico = { nome: '', especialidade: '', horario: '' }) {
  return `
    <div class="medico-edit-row">
      <input type="text" class="edit-medico-nome" placeholder="Nome" value="${escaparValorInput(medico.nome)}">
      <input type="text" class="edit-medico-especialidade" placeholder="Especialidade" value="${escaparValorInput(medico.especialidade)}">
      <input type="text" class="edit-medico-horario" placeholder="Horário" value="${escaparValorInput(medico.horario)}">
      <button type="button" class="btn-remover-item btn-remover-medico">Remover</button>
    </div>
  `;
}

function linhaVacinaHtml(vacina = { nome: '', disponvel: true }) {
  return `
    <div class="vacina-edit-row">
      <input type="text" class="edit-vacina-nome" placeholder="Nome da vacina" value="${escaparValorInput(vacina.nome)}">
      <label class="edit-vacina-check">
        <input type="checkbox" class="edit-vacina-disponivel" ${vacina.disponvel ? 'checked' : ''}>
        Disponível
      </label>
      <button type="button" class="btn-remover-item btn-remover-vacina">Remover</button>
    </div>
  `;
}

function abrirDetalhesLocal(local, forcarAbertura = true) {
  const tipoBadge = obterTipoBadge(local.tipo);
  const detalhesContainer = document.getElementById('detalhes-local');
  localDetalheAtualId = local.id;
  
  // Montar o HTML com os detalhes
  let html = `
    <div class="local-header">
      <div class="icon-box ${tipoBadge.classe}">
        <i class="bi ${tipoBadge.icon}"></i>
      </div>
      <div class="local-header-info">
        <h2>${local.nome}</h2>
        <p>${tipoBadge.nome}</p>
      </div>
    </div>

    <div class="info-section">
      <h3><i class="bi bi-geo-alt"></i> Endereço</h3>
      <div class="info-item">${local.endereco}</div>
    </div>

    <div class="info-section">
      <h3><i class="bi bi-telephone"></i> Telefone</h3>
      <div class="info-item">${local.telefone}</div>
    </div>

    <div class="info-section">
      <h3><i class="bi bi-clock"></i> Horário de Funcionamento</h3>
      <div class="info-item"><span class="info-label">${local.horario}</span></div>
    </div>

    <div class="info-section">
      <h3><i class="bi bi-person-badge"></i> Médicos Disponíveis</h3>
  `;

  // Adicionar médicos
  local.medicos.forEach(medico => {
    html += `
      <div class="medico-card">
        <span class="medico-nome">${medico.nome}</span>
        <div class="medico-info">
          <span>${medico.especialidade}</span>
          <span style="color: #0d6efd;">${medico.horario}</span>
        </div>
      </div>
    `;
  });

  html += `
    </div>

    <div class="info-section">
      <h3><i class="bi bi-capsule"></i> Vacinas</h3>
  `;

  // Adicionar vacinas
  local.vacinas.forEach(vacina => {
    const statusBadge = vacina.disponvel 
      ? '<span class="vacina-badge">Disponível</span>' 
      : '<span class="vacina-badge" style="background: #999;">Indisponível</span>';
    
    html += `
      <div class="vacina-item">
        <span class="vacina-nome">${vacina.nome}</span>
        ${statusBadge}
      </div>
    `;
  });

  // Regra: Logado E ID do local do usuário for igual ao ID do local do card
   const podeEditar = usuarioLogado !== null && usuarioLogado.localVinculadoId === local.id;

   html += `
     </div>

      ${podeEditar ? `
      <div class="info-section edit-section">
        <button id="btn-editar-local" class="btn-editar-local">
        <i class="bi bi-pencil-square"></i> Editar informações deste local
      </button>
      <p class="edit-hint">Edição liberada apenas para o colaborador deste local.</p>
      <p id="msg-edicao-local" class="edit-feedback" style="display: none;"></p>

      <form id="form-editar-local" class="form-editar-local" style="display: none;">
        <label>Telefone</label>
        <input id="edit-telefone" type="text" value="${escaparValorInput(local.telefone)}" required>

        <label>Médicos disponíveis</label>
        <div id="medicos-edit-list" class="edit-lista-itens">
          ${(local.medicos && local.medicos.length ? local.medicos : [{ nome: '', especialidade: '', horario: '' }]).map(linhaMedicoHtml).join('')}
        </div>
        <button type="button" id="btn-adicionar-medico" class="btn-adicionar-item">+ Adicionar médico</button>

        <label>Vacinas</label>
        <div id="vacinas-edit-list" class="edit-lista-itens">
          ${(local.vacinas && local.vacinas.length ? local.vacinas : [{ nome: '', disponvel: true }]).map(linhaVacinaHtml).join('')}
        </div>
        <button type="button" id="btn-adicionar-vacina" class="btn-adicionar-item">+ Adicionar vacina</button>

        <div class="edit-actions">
          <button type="submit" class="btn-editar-salvar">Salvar</button>
          <button type="button" id="btn-cancelar-edicao" class="btn-editar-cancelar">Cancelar</button>
        </div>
      </form>
    </div>
    ` : ''}
  `;

  detalhesContainer.innerHTML = html;

  const btnEditarLocal = document.getElementById('btn-editar-local');
  const formEditarLocal = document.getElementById('form-editar-local');
  const btnCancelarEdicao = document.getElementById('btn-cancelar-edicao');
  const btnAdicionarMedico = document.getElementById('btn-adicionar-medico');
  const btnAdicionarVacina = document.getElementById('btn-adicionar-vacina');
  const medicosEditList = document.getElementById('medicos-edit-list');
  const vacinasEditList = document.getElementById('vacinas-edit-list');
  const msgEdicaoLocal = document.getElementById('msg-edicao-local');

  if (btnEditarLocal) {
    btnEditarLocal.addEventListener('click', () => {
      if (!usuarioLogado || usuarioLogado.localVinculadoId !== local.id) {
        alert('Acesso negado. Você só pode editar o local ao qual está vinculado.');
        return;
      }
      formEditarLocal.style.display = 'flex';
      btnEditarLocal.style.display = 'none';
    });
  }

  if (btnCancelarEdicao) {
    btnCancelarEdicao.addEventListener('click', () => {
      formEditarLocal.style.display = 'none';
      btnEditarLocal.style.display = 'flex';
      if (msgEdicaoLocal) msgEdicaoLocal.style.display = 'none';
    });
  }

  if (btnAdicionarMedico && medicosEditList) {
    btnAdicionarMedico.addEventListener('click', () => {
      medicosEditList.insertAdjacentHTML('beforeend', linhaMedicoHtml());
    });
  }

  if (btnAdicionarVacina && vacinasEditList) {
    btnAdicionarVacina.addEventListener('click', () => {
      vacinasEditList.insertAdjacentHTML('beforeend', linhaVacinaHtml());
    });
  }

  if (medicosEditList) {
    medicosEditList.addEventListener('click', (e) => {
      if (e.target.classList.contains('btn-remover-medico')) {
        e.target.closest('.medico-edit-row')?.remove();
      }
    });
  }

  if (vacinasEditList) {
    vacinasEditList.addEventListener('click', (e) => {
      if (e.target.classList.contains('btn-remover-vacina')) {
        e.target.closest('.vacina-edit-row')?.remove();
      }
    });
  }

  if (formEditarLocal) {
    formEditarLocal.addEventListener('submit', (e) => {
      e.preventDefault();

      const novoTelefone = document.getElementById('edit-telefone').value.trim();

      local.telefone = novoTelefone || local.telefone;

      const medicosAtualizados = Array.from(medicosEditList.querySelectorAll('.medico-edit-row'))
        .map((row) => {
          const nome = row.querySelector('.edit-medico-nome')?.value.trim() || '';
          const especialidade = row.querySelector('.edit-medico-especialidade')?.value.trim() || '';
          const horario = row.querySelector('.edit-medico-horario')?.value.trim() || '';
          return { nome, especialidade, horario };
        })
        .filter(item => item.nome || item.especialidade || item.horario);

      const vacinasAtualizadas = Array.from(vacinasEditList.querySelectorAll('.vacina-edit-row'))
        .map((row) => {
          const nome = row.querySelector('.edit-vacina-nome')?.value.trim() || '';
          const disponvel = Boolean(row.querySelector('.edit-vacina-disponivel')?.checked);
          return { nome, disponvel };
        })
        .filter(item => item.nome);

      local.medicos = medicosAtualizados;
      local.vacinas = vacinasAtualizadas;

      salvarLocaisPersistidos();

      atualizarMarcadorLocal(local);
      abrirDetalhesLocal(local);

      const msgAtualizada = document.getElementById('msg-edicao-local');
      if (msgAtualizada) {
        msgAtualizada.textContent = 'Informações salvas com sucesso.';
        msgAtualizada.classList.add('success');
        msgAtualizada.style.display = 'block';
      }
    });
  }

  // Alternar para o modo de detalhes
  document.getElementById('modo-lista').style.display = 'none';
  document.getElementById('modo-detalhes').style.display = 'flex';
  document.getElementById('sidebar-titulo').textContent = local.nome;

  // Abrir a sidebar
  if(forcarAbertura) {
    abrirSidebar();
  }
}

function atualizarMarcadorLocal(localAtualizado) {
  const registroMarcador = marcadoresNoMapa.find(item => item.id === localAtualizado.id);
  if (!registroMarcador) return;

  registroMarcador.marker.setLatLng([localAtualizado.lat, localAtualizado.lng]);
  registroMarcador.marker.bindPopup(localAtualizado.nome);
}


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
  
  // Voltar ao modo de lista
  document.getElementById('modo-lista').style.display = 'block';
  document.getElementById('modo-detalhes').style.display = 'none';
  document.getElementById('sidebar-titulo').textContent = 'Locais Próximos';
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
const btnLogoutColaborador = document.getElementById('btn-logout-colaborador');
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

function atualizarUIColaborador() {
  if (usuarioLogado) {
    btnAbrirLogin.innerHTML = `<i class="bi bi-person-check-fill"></i> ${usuarioLogado.nome}`;
    btnAbrirLogin.style.background = '#198754';
    btnAbrirLogin.style.color = 'white';
    btnLogoutColaborador.style.display = 'inline-flex';
  } else {
    btnAbrirLogin.innerHTML = 'Usuário Colaborador';
    btnAbrirLogin.style.removeProperty('background');
    btnAbrirLogin.style.removeProperty('color');
    btnLogoutColaborador.style.display = 'none';
  }

  marcadoresNoMapa.forEach(item => {
    // É editável se tiver usuário logado E o ID do local dele for igual ao ID deste marcador
    const isEditable = usuarioLogado !== null && usuarioLogado.localVinculadoId === item.id;
    
    // Troca a "roupa" do marcador em tempo real
    item.marker.setIcon(gerarIconeMarcador(item.tipo, isEditable));
  });

  if (localDetalheAtualId !== null) {
    const localAtual = locaisDeSaude.find(item => item.id === localDetalheAtualId);
    const sidebarEstaAberta = sidebar.classList.contains('open');
    if (localAtual) {
      // Re-renderiza o HTML (para adicionar ou tirar o botão de edição),
      abrirDetalhesLocal(localAtual, sidebarEstaAberta);
    }
  }
}

btnAbrirLogin.addEventListener('click', () => {
  if (usuarioLogado) return;
  abrirModalLogin();
});
btnFecharLogin.addEventListener('click', fecharModalLogin);

btnLogoutColaborador.addEventListener('click', () => {
  usuarioLogado = false;
  atualizarUIColaborador();
});

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

  // 4. Mock de Autenticação (Simulando o Back-End)
  const usuarioEncontrado = listaColaboradores.find(user => user.email === email && user.senha === senha);

  if (usuarioEncontrado) {
    usuarioLogado = usuarioEncontrado;
    msgServidor.textContent = 'Login realizado com sucesso! Redirecionando...';
    msgServidor.classList.add('msg-success');
    
    // Simula um tempo de carregamento e muda o estado do botão lá no cabeçalho
    setTimeout(() => {
      fecharModalLogin();
      atualizarUIColaborador();
    }, 1500);

  } else {
    msgServidor.textContent = 'Credenciais incorretas. Tente novamente.';
    msgServidor.classList.add('msg-error');
    inputEmail.classList.add('input-error');
    inputSenha.classList.add('input-error');
  }
});

atualizarUIColaborador();