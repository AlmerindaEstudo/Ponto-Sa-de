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

  // MÉDICOS (somente se NÃO for farmácia)

  if(local.tipo !== 'farmacia'){

  html += `
  <div class="info-section">
  <h3><i class="bi bi-person-badge"></i> Médicos Disponíveis</h3>
  `;

  if(local.medicos){
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
  }

  html += `</div>`;

  }

  // VACINAS (somente se NÃO for farmácia)

  if(local.tipo !== 'farmacia'){

  html += `
  <div class="info-section">
  <h3><i class="bi bi-capsule"></i> Vacinas</h3>
  `;

  if(local.vacinas){
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
  }

  html += `</div>`;

  }

  // FARMÁCIA

 // FARMÁCIA
if (local.tipo === 'farmacia') {

html += `

<div class="farmacia-container">

<h2 class="titulo-farmacia">
<i class="bi bi-capsule-pill"></i> Farmácia
</h2>

<p class="descricao-farmacia">
Consulte medicamentos e produtos disponíveis.
</p>

<div class="farmacia-grid">

<div class="card farmacia-card">

<h3><i class="bi bi-capsule"></i> Medicamentos</h3>

<label class="info-label">Escolha uma condição</label>

<select id="doencaSelect" class="farmacia-select">
<option value="">Escolha uma condição</option>
${Object.keys(local.medicamentos || {}).map(d =>
`<option value="${d}">${d}</option>`
).join("")}
</select>

<div id="resultadoMedicamentos" class="resultado-box"></div>

</div>


<div class="card farmacia-card">

<h3><i class="bi bi-bag"></i> Produtos</h3>

<label class="info-label">Escolha um produto</label>

<select id="produtoSelect" class="farmacia-select">
<option value="">Escolha um produto</option>
${Object.keys(local.produtos || {}).map(p =>
`<option value="${p}">${p}</option>`
).join("")}
</select>

<div id="resultadoProduto" class="resultado-box"></div>

</div>

</div>

</div>

`;

}
  const podeEditar = usuarioLogado !== null && usuarioLogado.localVinculadoId === local.id;

  html += `</div>`;

  detalhesContainer.innerHTML = html;

  document.getElementById('modo-lista').style.display = 'none';
  document.getElementById('modo-detalhes').style.display = 'flex';
  document.getElementById('sidebar-titulo').textContent = local.nome;

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