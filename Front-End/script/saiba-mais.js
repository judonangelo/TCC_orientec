const API_BASE = "http://localhost:3000";

async function carregarCursoPorId(id) {
    const container = document.getElementById('conteudo-curso');

    try {
        const response = await fetch(`${API_BASE}/cursos/${id}`);

        if (response.status === 404) {
            container.innerHTML = `
                        <div class="erro-card">
                            <h2>Curso não encontrado</h2>
                            <p>O curso que você procura não existe ou foi removido.</p>
                            <button class="btn-voltar" onclick="history.back()">← Voltar para Cursos</button>
                        </div>
                    `;
            return;
        }

        if (!response.ok) {
            throw new Error(`Erro ao buscar curso: ${response.status}`);
        }

        const curso = await response.json();

        container.innerHTML = `
                    <h1>${curso.nome}</h1>
                    <div class="info-grid">
                        <div class="info-item"><strong>Duração:</strong> ${curso.duracao} semestres</div>
                        <div class="info-item"><strong>Faixa salarial:</strong> ${curso.salario}</div>
                        <div class="info-item"><strong>Carga Horária:</strong> ${curso.carga_horaria}</div>
                    </div>
                    <div class="secao destaque">
                        <h3>Descrição</h3>
                        <p>${curso.descricao}</p>
                    </div>
                    <div class="secao">
                        <h3>Mercado de Trabalho</h3>
                        <p>${curso.mercado}</p>
                    </div>
                    <div class="secao">
                        <h3>Perfil do Aluno</h3>
                        <p>${curso.perfil}</p>
                    </div>
                `;

    } catch (error) {
        console.error(error);
        container.innerHTML = `
                    <div class="erro-card">
                        <h2>Erro ao carregar curso</h2>
                        <p>Não foi possível buscar os dados. Tente novamente mais tarde.</p>
                        <button class="btn-voltar" onclick="history.back()">← Voltar para Cursos</button>
                    </div>
                `;
    }
}

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const container = document.getElementById('conteudo-curso');

if (!id) {
    container.innerHTML = `
                <div class="erro-card">
                    <h2>Curso não encontrado</h2>
                    <p>Nenhum curso foi selecionado.</p>
                    <button class="btn-voltar" onclick="history.back()">← Voltar para Cursos</button>
                </div>
            `;
} else {
    carregarCursoPorId(id);
}

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