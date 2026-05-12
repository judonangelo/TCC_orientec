// ============================================
// VERIFICAÇÃO DE AUTENTICAÇÃO
// ============================================
const tokenAluno = localStorage.getItem("tokenOrientec");
if (!tokenAluno) {
    alert("Você precisa estar logado para acessar esta área.");
    window.location.href = "login.html";
}

// ============================================
// PREENCHER CABEÇALHO E PAINEL COM DADOS REAIS
// ============================================
const nomeUsuario = localStorage.getItem("nomeUsuario") || "Usuário";
const emailUsuario = localStorage.getItem("emailUsuario") || "email@exemplo.com";


// Atualiza o avatar com as iniciais
const avatarEl = document.getElementById("panelInitials");
if (avatarEl) {
    const partes = nomeUsuario.trim().split(" ");
    const iniciais = partes.length > 1 
        ? (partes[0][0] + partes[partes.length - 1][0]).toUpperCase()
        : (nomeUsuario[0] || "?").toUpperCase();
    avatarEl.textContent = iniciais;
}

// Preenche os campos do painel lateral
const panelName = document.getElementById("panelName");
const panelEmail = document.getElementById("panelEmail");
const viewName = document.getElementById("viewName");
const viewEmail = document.getElementById("viewEmail");

if (panelName) panelName.textContent = nomeUsuario;
if (panelEmail) panelEmail.textContent = emailUsuario;
if (viewName) viewName.textContent = nomeUsuario;
if (viewEmail) viewEmail.textContent = emailUsuario;

// ============================================
// FUNÇÕES DO PAINEL LATERAL
// ============================================
function openPanel() {
    document.getElementById('overlay').classList.add('open');
    document.getElementById('profilePanel').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closePanel() {
    document.getElementById('overlay').classList.remove('open');
    document.getElementById('profilePanel').classList.remove('open');
    document.body.style.overflow = '';
}

function logout() {
    if (confirm("Tem certeza que deseja sair?")) {
        localStorage.removeItem("emailUsuario");
        localStorage.removeItem("tokenOrientec");
        localStorage.removeItem("nomeUsuario");
        window.location.href = "index.html";
    }
}

// Fechar painel ao clicar no overlay
document.getElementById('overlay').addEventListener('click', closePanel);