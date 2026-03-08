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