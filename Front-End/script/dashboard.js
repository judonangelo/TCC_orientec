// ============================================
// PROTEÇÃO DE ROTA
// ============================================
const token = localStorage.getItem("tokenIntranet");
if (!token) {
    alert("Acesso Negado! Área restrita a administradores.");
    window.location.href = "intranet.html";
}

// ============================================
// CONFIGURAÇÃO
// ============================================
const API_URL = "http://localhost:3000";

// ============================================
// USUÁRIOS (ainda não integrado ao banco)
// ============================================
let usuarios = [
    { id: 1, nome: "Julia", email: "julia@email.com", perfil: "aluno", data_cadastro: "2024-01-15", status: "ativo" },
    { id: 2, nome: "Joao Victor", email: "joao@email.com", perfil: "admin", data_cadastro: "2026-03-10", status: "ativo" }
];
let proximoIdUsuario = 3;
let itemParaExcluir = null;
let tipoExclusao = null;

// ============================================
// NAVEGAÇÃO DO SIDEBAR
// ============================================
document.querySelectorAll('.sidebar-link').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
        this.classList.add('active');
        const section = this.dataset.section;
        document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
        document.getElementById(`${section}-section`).classList.add('active');

        if (section === 'relatorios') carregarRelatorios();
        if (section === 'cursos') carregarCursos();
    });
});

// ============================================
// USUÁRIOS (funções existentes)
// ============================================
function carregarUsuarios() {
    const tbody = document.getElementById('usuarios-table-body');
    tbody.innerHTML = '';
    usuarios.forEach(usuario => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${usuario.id}</td>
            <td>${usuario.nome}</td>
            <td>${usuario.email}</td>
            <td><span class="badge badge-${usuario.perfil}">${usuario.perfil}</span></td>
            <td>${usuario.data_cadastro}</td>
            <td><span class="status status-${usuario.status}">${usuario.status}</span></td>
            <td class="acoes">
                <button class="btn-editar" onclick="editarUsuario(${usuario.id})">Editar</button>
                <button class="btn-excluir" onclick="confirmarExclusaoUsuario(${usuario.id})">Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    carregarRelatorios(); // <-- atualiza os cards de relatório
}

function abrirModalCriarUsuario() {
    document.getElementById('form-criar-usuario').reset();
    document.getElementById('modal-criar-usuario').style.display = 'flex';
}
function fecharModalCriarUsuario() {
    document.getElementById('modal-criar-usuario').style.display = 'none';
}
function abrirModalEditarUsuario(usuario) {
    document.getElementById('editar-usuario-id').value = usuario.id;
    document.getElementById('editar-usuario-nome').value = usuario.nome;
    document.getElementById('editar-usuario-email').value = usuario.email;
    document.getElementById('editar-usuario-perfil').value = usuario.perfil;
    document.getElementById('editar-usuario-status').value = usuario.status;
    document.getElementById('modal-editar-usuario').style.display = 'flex';
}
function fecharModalEditarUsuario() {
    document.getElementById('modal-editar-usuario').style.display = 'none';
}
function editarUsuario(id) {
    const usuario = usuarios.find(u => u.id === id);
    if (usuario) abrirModalEditarUsuario(usuario);
}
function confirmarExclusaoUsuario(id) {
    itemParaExcluir = id;
    tipoExclusao = 'usuario';
    document.getElementById('modal-confirmacao').style.display = 'flex';
}
function excluirUsuario(id) {
    usuarios = usuarios.filter(u => u.id !== id);
    carregarUsuarios();
    mostrarMensagem('usuarios-mensagem', 'Usuário excluído com sucesso!', 'sucesso');
}

// ============================================
// CRUD CURSOS (integrado ao backend)
// ============================================
async function carregarCursos() {
    const tbody = document.getElementById('cursos-table-body');
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Carregando...</td></tr>';

    try {
        const response = await fetch(`${API_URL}/cursos`);
        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
        const cursos = await response.json();

        tbody.innerHTML = '';
        if (cursos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Nenhum curso cadastrado.</td></tr>';
            carregarRelatorios();
            return;
        }

        cursos.forEach(curso => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${curso.id}</td>
                <td>${curso.nome}</td>
                <td>${curso.duracao} semestres</td>
                <td>${curso.vagas ?? '—'}</td>
                <td><span class="status status-${curso.status}">${curso.status}</span></td>
                <td class="acoes">
                    <button class="btn-editar" onclick="editarCurso(${curso.id})">Editar</button>
                    <button class="btn-excluir" onclick="confirmarExclusaoCurso(${curso.id})">Excluir</button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        carregarRelatorios();
    } catch (error) {
        console.error("Erro ao carregar cursos:", error);
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:red;">Erro ao carregar cursos.</td></tr>';
    }
}

function abrirModalCurso(curso = null) {
    document.getElementById('modal-curso').style.display = 'flex';
    if (curso) {
        document.getElementById('modal-curso-titulo').textContent = 'Editar Curso';
        document.getElementById('curso-id').value = curso.id;
        document.getElementById('curso-nome').value = curso.nome;
        document.getElementById('curso-duracao').value = curso.duracao;
        document.getElementById('curso-vagas').value = curso.vagas ?? '';
        document.getElementById('curso-descricao').value = curso.descricao ?? '';
        document.getElementById('curso-area').value = curso.area ?? '';
        document.getElementById('curso-resumo').value = curso.resumo ?? '';
        document.getElementById('curso-carga-horaria').value = curso.carga_horaria ?? '';
        document.getElementById('curso-salario').value = curso.salario ?? '';
        document.getElementById('curso-mercado').value = curso.mercado ?? '';
        document.getElementById('curso-perfil').value = curso.perfil ?? '';
        document.getElementById('curso-status').value = curso.status;
    } else {
        document.getElementById('modal-curso-titulo').textContent = 'Novo Curso';
        document.getElementById('form-curso').reset();
        document.getElementById('curso-id').value = '';
    }
}

function fecharModalCurso() {
    document.getElementById('modal-curso').style.display = 'none';
}

async function editarCurso(id) {
    try {
        const response = await fetch(`${API_URL}/cursos/${id}`);
        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
        const curso = await response.json();
        abrirModalCurso(curso);
    } catch (error) {
        console.error("Erro ao buscar curso para edição:", error);
        mostrarMensagem('cursos-mensagem', 'Erro ao carregar dados do curso.', 'erro');
    }
}

function confirmarExclusaoCurso(id) {
    itemParaExcluir = id;
    tipoExclusao = 'curso';
    document.getElementById('modal-confirmacao').style.display = 'flex';
}

async function excluirCurso(id) {
    try {
        const response = await fetch(`${API_URL}/cursos/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
        await carregarCursos();
        mostrarMensagem('cursos-mensagem', 'Curso excluído com sucesso!', 'sucesso');
    } catch (error) {
        console.error("Erro ao excluir curso:", error);
        mostrarMensagem('cursos-mensagem', 'Erro ao excluir curso.', 'erro');
    }
}

document.getElementById('btn-confirmar-exclusao').addEventListener('click', async function () {
    if (tipoExclusao === 'usuario') excluirUsuario(itemParaExcluir);
    else if (tipoExclusao === 'curso') await excluirCurso(itemParaExcluir);
    fecharModalConfirmacao();
});

function fecharModalConfirmacao() {
    document.getElementById('modal-confirmacao').style.display = 'none';
    itemParaExcluir = null;
    tipoExclusao = null;
}

// ============================================
// SUBMIT DO FORMULÁRIO DE CURSO
// ============================================
document.getElementById('form-curso').addEventListener('submit', async function (e) {
    e.preventDefault();
    const id = document.getElementById('curso-id').value;
    const payload = {
        nome: document.getElementById('curso-nome').value.trim(),
        duracao: parseInt(document.getElementById('curso-duracao').value),
        vagas: parseInt(document.getElementById('curso-vagas').value),
        descricao: document.getElementById('curso-descricao').value.trim(),
        status: document.getElementById('curso-status').value,
        area: document.getElementById('curso-area').value.trim(),
        resumo: document.getElementById('curso-resumo').value.trim(),
        carga_horaria: document.getElementById('curso-carga-horaria').value.trim() || null,
        salario: document.getElementById('curso-salario').value.trim() || null,
        mercado: document.getElementById('curso-mercado').value.trim() || null,
        perfil: document.getElementById('curso-perfil').value.trim() || null
    };

    try {
        let response;
        if (id) {
            response = await fetch(`${API_URL}/cursos/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        } else {
            response = await fetch(`${API_URL}/cursos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        }

        if (!response.ok) {
            const erro = await response.json();
            throw new Error(erro.mensagem || `Erro HTTP: ${response.status}`);
        }

        await carregarCursos();
        fecharModalCurso();
        mostrarMensagem(
            'cursos-mensagem',
            id ? 'Curso atualizado com sucesso!' : 'Curso cadastrado com sucesso!',
            'sucesso'
        );
    } catch (error) {
        console.error("Erro ao salvar curso:", error);
        mostrarMensagem('cursos-mensagem', `Erro: ${error.message}`, 'erro');
    }
});

// ============================================
// RELATÓRIOS (busca do backend)
// ============================================
async function carregarRelatorios() {
    try {
        const response = await fetch(`${API_URL}/relatorios`);
        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
        const stats = await response.json();

        document.getElementById('total-usuarios').textContent = stats.totalUsuarios;
        document.getElementById('usuarios-ativos').textContent = stats.usuariosAtivos;
        document.getElementById('total-cursos').textContent = stats.totalCursos;
        document.getElementById('cursos-ativos').textContent = stats.cursosAtivos;
    } catch (error) {
        console.error("Erro ao carregar relatórios:", error);
    }
}

// ============================================
// FUNÇÕES AUXILIARES
// ============================================
function mostrarMensagem(elementoId, texto, tipo) {
    const elemento = document.getElementById(elementoId);
    elemento.textContent = texto;
    elemento.className = `mensagem ${tipo}`;
    setTimeout(() => {
        elemento.className = 'mensagem';
        elemento.textContent = '';
    }, 3000);
}

function salvarConfiguracoes() {
    alert('Configurações salvas com sucesso!');
}

function logout() {
    if (confirm('Tem certeza que deseja sair?')) {
        localStorage.removeItem("tokenIntranet");
        window.location.href = 'index.html';
    }
}

// ============================================
// INICIALIZAÇÃO
// ============================================
carregarUsuarios();
carregarCursos();
carregarRelatorios();

window.addEventListener('click', function (e) {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});