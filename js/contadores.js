// --- LÓGICA DE CONTAGEM ---

function atualizarContadoresTotais() {
  let contagemHospital = 0;
  let contagemPosto = 0;
  let contagemUpa = 0;
  let contagemFarmacia = 0;

  // Percorre a lista de locais e soma as quantidades totais
  locaisDeSaude.forEach(local => {
    if (local.tipo === 'hospital') contagemHospital++;
    else if (local.tipo === 'posto') contagemPosto++;
    else if (local.tipo === 'upa') contagemUpa++;
    else if (local.tipo === 'farmacia') contagemFarmacia++;
  });

  // Atualiza os números no HTML
  document.getElementById('count-hospital').innerText = contagemHospital;
  document.getElementById('count-posto').innerText = contagemPosto;
  document.getElementById('count-upa').innerText = contagemUpa;
  document.getElementById('count-farmacia').innerText = contagemFarmacia;
}

// Chama a função quando a página carrega
atualizarContadoresTotais();
