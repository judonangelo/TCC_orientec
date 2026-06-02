// ============================================
// HOME - SEM VERIFICAÇÃO (auth-check.js já protegeu)
// ============================================

const nomeUsuario = localStorage.getItem("nomeUsuario") || "Usuário";
const emailUsuario = localStorage.getItem("emailUsuario") || "email@exemplo.com";

// Avatar com iniciais
const avatarEl = document.getElementById("panelInitials");
if (avatarEl) {
    const partes = nomeUsuario.trim().split(" ");
    const iniciais = partes.length > 1 
        ? (partes[0][0] + partes[partes.length - 1][0]).toUpperCase()
        : (nomeUsuario[0] || "?").toUpperCase();
    avatarEl.textContent = iniciais;
}

// Preenche painel lateral
const panelName = document.getElementById("panelName");
const panelEmail = document.getElementById("panelEmail");
const viewName = document.getElementById("viewName");
const viewEmail = document.getElementById("viewEmail");
if (panelName) panelName.textContent = nomeUsuario;
if (panelEmail) panelEmail.textContent = emailUsuario;
if (viewName) viewName.textContent = nomeUsuario;
if (viewEmail) viewEmail.textContent = emailUsuario;

function openPanel() {
    document.getElementById('overlay')?.classList.add('open');
    document.getElementById('profilePanel')?.classList.add('open');
    document.body.style.overflow = 'hidden';
}
function closePanel() {
    document.getElementById('overlay')?.classList.remove('open');
    document.getElementById('profilePanel')?.classList.remove('open');
    document.body.style.overflow = '';
}
function logout() {
    if (confirm("Tem certeza que deseja sair?")) {
        localStorage.clear();
        window.location.href = "index.html";
    }
}
document.getElementById('overlay')?.addEventListener('click', closePanel);