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

