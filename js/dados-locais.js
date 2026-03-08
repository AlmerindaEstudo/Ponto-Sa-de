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
tipo: 'farmacia',
nome: 'Farmácia Popular 2 de Julho',
lat: -15.25123,
lng: -40.24521,
endereco: 'Rua das Flores, 123',
telefone: '(77)99999-9999',
horario: '08:00 às 18:00',

medicamentos: {
  diabetes: [{ nome: "Metformina 500mg", status: true }],
  hipertensao: [{ nome: "Losartana 50mg", status: true }]
},

produtos: {
  fralda: { nome: "Fraldas Geriátricas", status: true },
  absorvente: { nome: "Absorvente", status: true }
}

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


