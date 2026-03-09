// --- LÓGICA DE ABERTURA DE DETALHES DO LOCAL ---

function obterTipoBadge(tipo) {
  const tipos = {
    hospital: { nome: 'Hospital', icon: 'bi-hospital', classe: 'red' },
    posto: { nome: 'Posto de Saúde', icon: 'bi-buildings', classe: 'blue' },
    upa: { nome: 'UPA', icon: 'bi-building', classe: 'orange' },
    farmacia: { nome: 'Farmácia', icon: 'bi-capsule-pill', classe: 'green' }
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

// Estudo: Função para criar a linha de edição de Medicamentos/Produtos
function linhaFarmaciaEditavelHtml(item = { nome: '', disponivel: true }, tipoItem) {
  return `
    <div class="farmacia-edit-row" style="display: flex; gap: 10px; margin-bottom: 10px; align-items: center;">
      <input type="text" class="edit-${tipoItem}-nome" placeholder="Nome" value="${escaparValorInput(item.nome)}" style="flex: 1;">
      <label class="edit-check">
        <input type="checkbox" class="edit-${tipoItem}-disponivel" ${item.disponivel ? 'checked' : ''}>
        Em estoque
      </label>
      <button type="button" class="btn-remover-item" onclick="this.parentElement.remove()" style="color: red; border: none; background: none; cursor: pointer;">
        <i class="bi bi-trash"></i>
      </button>
    </div>
  `;
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

  // 1. Cabeçalho e Informações Básicas
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
  `;

  // 2. Verificação de Permissão
  const podeEditar = usuarioLogado !== null && usuarioLogado.localVinculadoId === local.id;

  // 3. SEÇÃO MÉDICOS E VACINAS (Apenas para Hospitais/Postos/UPAs)
  if (local.tipo !== 'farmacia') {
    // Médicos
    html += `<div class="info-section"><h3><i class="bi bi-person-badge"></i> Médicos Disponíveis</h3>`;
    if (local.medicos) {
      local.medicos.forEach(medico => {
        html += `
          <div class="medico-card">
            <span class="medico-nome">${medico.nome}</span>
            <div class="medico-info">
              <span>${medico.especialidade}</span>
              <span style="color: #0d6efd;">${medico.horario}</span>
            </div>
          </div>`;
      });
    }
    html += `</div>`;

    // Vacinas
    html += `<div class="info-section"><h3><i class="bi bi-capsule"></i> Vacinas</h3>`;
    if (local.vacinas) {
      local.vacinas.forEach(vacina => {
        const statusBadge = vacina.disponvel 
          ? '<span class="vacina-badge">Disponível</span>' 
          : '<span class="vacina-badge" style="background: #999;">Indisponível</span>';
        html += `<div class="vacina-item"><span class="vacina-nome">${vacina.nome}</span>${statusBadge}</div>`;
      });
    }
    html += `</div>`;
  }

  // 4. SEÇÃO FARMÁCIA (Implementação da Edição solicitada)
  if (local.tipo === 'farmacia') {
    if (podeEditar) {
      // VISÃO DO COLABORADOR (EDIÇÃO)
      html += `
        <div class="farmacia-container">
          <h2 class="titulo-farmacia"><i class="bi bi-pencil-square"></i> Gerenciar Estoque</h2>
          
          <div class="info-section">
            <h3>Medicamentos</h3>
            <div id="lista-edit-medicamentos">
               ${(local.medicamentos?.Geral || []).map(m => linhaFarmaciaEditavelHtml(m, 'med')).join('')}
            </div>
            <button type="button" class="btn-add-item" onclick="document.getElementById('lista-edit-medicamentos').insertAdjacentHTML('beforeend', linhaFarmaciaEditavelHtml({nome:'', disponivel:true}, 'med'))" style="width:100%; margin-top:10px;">+ Adicionar Medicamento</button>
          </div>

          <div class="info-section" style="margin-top:20px;">
            <h3>Produtos</h3>
            <div id="lista-edit-produtos">
               ${(local.produtos?.Geral || []).map(p => linhaFarmaciaEditavelHtml(p, 'prod')).join('')}
            </div>
            <button type="button" class="btn-add-item" onclick="document.getElementById('lista-edit-produtos').insertAdjacentHTML('beforeend', linhaFarmaciaEditavelHtml({nome:'', disponivel:true}, 'prod'))" style="width:100%; margin-top:10px;">+ Adicionar Produto</button>
          </div>

          <button type="button" class="btn-submit" style="margin-top:20px; background:#198754;" onclick="salvarMudancasFarmacia()">Salvar Alterações</button>
        </div>
      `;
    } else {
      // VISÃO DO CIDADÃO (BUSCA - Seu código original)
      html += `
        <div class="farmacia-container">
          <h2 class="titulo-farmacia"><i class="bi bi-capsule-pill"></i> Farmácia</h2>
          <div class="farmacia-grid">
            <div class="card farmacia-card">
              <h3>Medicamentos</h3>
              <select id="doencaSelect" class="farmacia-select">
                <option value="">Escolha uma condição</option>
                ${Object.keys(local.medicamentos || {}).map(d => `<option value="${d}">${d}</option>`).join("")}
              </select>
              <div id="resultadoMedicamentos" class="resultado-box"></div>
            </div>
            <div class="card farmacia-card">
              <h3>Produtos</h3>
              <select id="produtoSelect" class="farmacia-select">
                <option value="">Escolha um produto</option>
                ${Object.keys(local.produtos || {}).map(p => `<option value="${p}">${p}</option>`).join("")}
              </select>
              <div id="resultadoProduto" class="resultado-box"></div>
            </div>
          </div>
        </div>`;
    }
  }

  // 5. Finalização e Renderização
  html += `</div>`;
  detalhesContainer.innerHTML = html;

  document.getElementById('modo-lista').style.display = 'none';
  document.getElementById('modo-detalhes').style.display = 'flex';
  document.getElementById('sidebar-titulo').textContent = local.nome;

  if (forcarAbertura) {
    abrirSidebar();
  }
}

function atualizarMarcadorLocal(localAtualizado) {

  const registroMarcador = marcadoresNoMapa.find(item => item.id === localAtualizado.id);

  if (!registroMarcador) return;

  registroMarcador.marker.setLatLng([localAtualizado.lat, localAtualizado.lng]);
  registroMarcador.marker.bindPopup(localAtualizado.nome);

}

function salvarMudancasFarmacia() {
  // 1. Busca o local atual na lista global
  const local = locaisDeSaude.find(l => l.id === localDetalheAtualId);
  if (!local) return;

  // 2. Captura novos medicamentos da interface
const medRows = document.querySelectorAll('#lista-edit-medicamentos .farmacia-edit-row');
const novosMeds = Array.from(medRows).map(row => ({
    nome: row.querySelector('.edit-med-nome').value,
    status: row.querySelector('.edit-med-disponivel').checked // Alterado de 'disponivel' para 'status'
})).filter(item => item.nome.trim() !== "");

// 3. Captura novos produtos da interface
const prodRows = document.querySelectorAll('#lista-edit-produtos .farmacia-edit-row');
const novosProds = Array.from(prodRows).map(row => ({
    nome: row.querySelector('.edit-prod-nome').value,
    status: row.querySelector('.edit-prod-disponivel').checked // Alterado de 'disponivel' para 'status'
})).filter(item => item.nome.trim() !== "");

  // 4. Atualiza o objeto local
  local.medicamentos = { "Geral": novosMeds };
  local.produtos = { "Geral": novosProds };

  // 5. Salva no localStorage
  salvarLocaisPersistidos(); 

  alert('Estoque atualizado com sucesso!');
  
  // Recarrega os detalhes para refletir as mudanças
  abrirDetalhesLocal(local);
}