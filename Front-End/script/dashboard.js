const token = localStorage.getItem("tokenIntranet");

const authHeaders = () => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
});

// ============================================
// CONFIGURAÇÃO
// ============================================
const API_BASE = "http://localhost:3000";

let usuariosGlobal = [];
let paginaAtual = 1;
const ITENS_POR_PAGINA = 10;
let termoPesquisa = '';
let filtroNivel = 'todos';  // 'todos', 'admin', 'aluno'

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
        if (section === 'teste') carregarPerguntas()
    });
});

// ============================================
// USUÁRIOS - FILTROS COMBINADOS
// ============================================

function renderizarUsuarios(usuarios) {
    const tbody = document.getElementById('usuarios-table-body');
    tbody.innerHTML = '';

    const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
    const fim = inicio + ITENS_POR_PAGINA;
    const paginaUsuarios = usuarios.slice(inicio, fim);

    if (paginaUsuarios.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Nenhum usuário encontrado.</td></tr>';
    } else {
        paginaUsuarios.forEach(usuario => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${usuario.id}</td>
                <td>${usuario.nome}</td>
                <td>${usuario.email}</td>
                <td>${usuario.nivel}</td>
                <td>${usuario.data}</td>
                <td class="acoes">
                    <button class="btn-editar" onclick="abrirModalEditarUsuario(${usuario.id}, '${usuario.nivel}')">Editar</button>
                    <button class="btn-excluir" onclick="confirmarExclusaoUsuario(${usuario.id})">Excluir</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    atualizarControlesPaginacao(usuarios.length);
}

function atualizarControlesPaginacao(totalItens) {
    const container = document.getElementById('paginacao-container');
    if (!container) return;

    const totalPaginas = Math.ceil(totalItens / ITENS_POR_PAGINA);
    container.innerHTML = '';

    if (totalPaginas <= 1) return;

    // Botão Anterior
    const btnAnterior = document.createElement('button');
    btnAnterior.textContent = '← Anterior';
    btnAnterior.className = 'btn-paginacao btn-anterior';
    btnAnterior.disabled = paginaAtual === 1;
    btnAnterior.addEventListener('click', () => {
        if (paginaAtual > 1) {
            paginaAtual--;
            aplicarFiltros();
        }
    });
    container.appendChild(btnAnterior);

    // Indicador de página
    const spanPagina = document.createElement('span');
    spanPagina.textContent = ` Página ${paginaAtual} de ${totalPaginas} `;
    spanPagina.style.margin = '0 10px';
    container.appendChild(spanPagina);

    // Botão Próximo
    const btnProximo = document.createElement('button');
    btnProximo.textContent = 'Próximo →';
    btnProximo.className = 'btn-paginacao btn-proximo';
    btnProximo.disabled = paginaAtual === totalPaginas;
    btnProximo.addEventListener('click', () => {
        if (paginaAtual < totalPaginas) {
            paginaAtual++;
            aplicarFiltros();
        }
    });
    container.appendChild(btnProximo);
}

function aplicarFiltros() {
    const termo = termoPesquisa.toLowerCase();
    const filtrados = usuariosGlobal.filter(usuario => {
        // Filtro por nome (startsWith)
        const matchNome = usuario.nome.toLowerCase().startsWith(termo);
        if (!matchNome) return false;

        // Filtro por nível
        if (filtroNivel === 'todos') return true;
        return usuario.nivel === filtroNivel;
    });
    renderizarUsuarios(filtrados);
}

function atualizarUsuariosFiltrados() {
    paginaAtual = 1;  // reset para primeira página ao filtrar
    aplicarFiltros();
}

// Evento do campo de pesquisa
const pesquisaInput = document.getElementById('pesquisa-nome');
if (pesquisaInput) {
    pesquisaInput.addEventListener('input', function (e) {
        termoPesquisa = e.target.value.trim();
        atualizarUsuariosFiltrados();
    });
}

// Evento do filtro de nível
const filtroSelect = document.getElementById('filtro-tipo-usuario');
if (filtroSelect) {
    filtroSelect.addEventListener('change', function (e) {
        filtroNivel = e.target.value;
        atualizarUsuariosFiltrados();
    });
}

async function carregarUsuarios() {
    const tbody = document.getElementById('usuarios-table-body');
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Carregando...</td></tr>';

    try {
        const response = await fetch(`${API_BASE}/usuarios`, { headers: authHeaders() });
        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                logout();
                return;
            }
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        const usuarios = await response.json();
        usuariosGlobal = usuarios;
        paginaAtual = 1;
        termoPesquisa = '';
        filtroNivel = 'todos';
        if (pesquisaInput) pesquisaInput.value = '';
        if (filtroSelect) filtroSelect.value = 'todos';

        atualizarUsuariosFiltrados();

        carregarRelatorios();
    } catch (error) {
        console.error("Erro ao carregar usuários:", error);
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:red;">Erro ao carregar usuários.</td></tr>';
    }
}

// ============================================
// MODAL EDITAR USUÁRIO
// ============================================
const formEditar = document.getElementById('form-editar-usuario');
if (formEditar) {
    formEditar.addEventListener('submit', async function (e) {
        e.preventDefault();
        const id = document.getElementById('editar-usuario-id').value;
        const payload = {
            nivel: document.getElementById('editar-usuario-nivel').value,
        };

        try {
            const response = await fetch(`${API_BASE}/usuarios/${id}`, {
                method: 'PUT',
                headers: authHeaders(),
                body: JSON.stringify(payload)
            });
            const dados = await response.json();
            if (!response.ok) throw new Error(dados.mensagem || 'Erro ao atualizar');
            await carregarUsuarios();
            fecharModalEditarUsuario();
            mostrarMensagem('usuarios-mensagem', dados.mensagem, 'sucesso');
        } catch (erro) {
            mostrarMensagem('usuarios-mensagem', `Erro: ${erro.message}`, 'erro');
        }
    });
}

function abrirModalEditarUsuario(id, nivel) {
    document.getElementById('editar-usuario-id').value = id;
    document.getElementById('editar-usuario-nivel').value = nivel;
    document.getElementById('modal-editar-usuario').style.display = 'flex';
}

function fecharModalEditarUsuario() {
    document.getElementById('modal-editar-usuario').style.display = 'none';
}

// ============================================
// EXCLUSÃO DE USUÁRIO
// ============================================
let itemParaExcluir = null;
let tipoExclusao = null;

function confirmarExclusaoUsuario(id) {
    itemParaExcluir = id;
    tipoExclusao = 'usuario';
    document.getElementById('modal-confirmacao').style.display = 'flex';
}

async function excluirUsuario(id) {
    try {
        const response = await fetch(`${API_BASE}/usuarios/${id}`, {
            method: 'DELETE',
            headers: authHeaders()
        });
        const dados = await response.json();
        if (!response.ok) throw new Error(dados.mensagem || 'Erro ao excluir');
        await carregarUsuarios();
        mostrarMensagem('usuarios-mensagem', dados.mensagem, 'sucesso');
    } catch (erro) {
        mostrarMensagem('usuarios-mensagem', `Erro: ${erro.message}`, 'erro');
    }
}

// ============================================
// CRUD CURSOS
// ============================================
async function carregarCursos() {
    const tbody = document.getElementById('cursos-table-body');
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Carregando...</td></tr>';

    try {
        const response = await fetch(`${API_BASE}/cursos`, { headers: authHeaders() });
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
        const response = await fetch(`${API_BASE}/cursos/${id}`, { headers: authHeaders() });
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
        const response = await fetch(`${API_BASE}/cursos/${id}`, {
            method: 'DELETE',
            headers: authHeaders()
        });
        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
        await carregarCursos();
        mostrarMensagem('cursos-mensagem', 'Curso excluído com sucesso!', 'sucesso');
    } catch (error) {
        console.error("Erro ao excluir curso:", error);
        mostrarMensagem('cursos-mensagem', 'Erro ao excluir curso.', 'erro');
    }
}

// ============================================
// CONFIRMAÇÃO GENÉRICA (exclusão)
// ============================================
const btnConfirmar = document.getElementById('btn-confirmar-exclusao');
if (btnConfirmar) {
    btnConfirmar.addEventListener('click', async function () {
        if (tipoExclusao === 'usuario') excluirUsuario(itemParaExcluir);
        else if (tipoExclusao === 'curso') await excluirCurso(itemParaExcluir);
        else if (tipoExclusao === 'pergunta') await excluirPergunta(itemParaExcluir)
        fecharModalConfirmacao();
    });
}

function fecharModalConfirmacao() {
    document.getElementById('modal-confirmacao').style.display = 'none';
    itemParaExcluir = null;
    tipoExclusao = null;
}

// ============================================
// SUBMIT DO FORMULÁRIO DE CURSO
// ============================================
const formCurso = document.getElementById('form-curso');
if (formCurso) {
    formCurso.addEventListener('submit', async function (e) {
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
                response = await fetch(`${API_BASE}/cursos/${id}`, {
                    method: 'PUT',
                    headers: authHeaders(),
                    body: JSON.stringify(payload)
                });
            } else {
                response = await fetch(`${API_BASE}/cursos`, {
                    method: 'POST',
                    headers: authHeaders(),
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
}

// ============================================
// RELATÓRIOS
// ============================================
async function carregarRelatorios() {
    try {
        const response = await fetch(`${API_BASE}/relatorios`, { headers: authHeaders() });
        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
        const stats = await response.json();

        document.getElementById('total-usuarios').textContent = stats.totalUsuarios;
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
    if (!elemento) return;
    elemento.textContent = texto;
    elemento.className = `mensagem ${tipo}`;
    setTimeout(() => {
        elemento.className = 'mensagem';
        elemento.textContent = '';
    }, 3000);
}

function logout() {
    if (confirm('Tem certeza que deseja sair?')) {
        localStorage.removeItem("emailUsuario");
        localStorage.removeItem("tokenIntranet");
        localStorage.removeItem("nomeUsuario");
        localStorage.removeItem("nivelUsuario")
        window.location.href = 'index.html';
    }
}

// ============================================
// INICIALIZAÇÃO
// ============================================
carregarUsuarios();
carregarCursos();

window.addEventListener('click', function (e) {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});

// parte do teste

const CHAVES_CURSOS = [
    { chave: 'dev', nome: 'Dev' },
    { chave: 'quimica', nome: 'Química' },
    { chave: 'logistica', nome: 'Logística' },
    { chave: 'eletronica', nome: 'Eletrônica' },
    { chave: 'adm', nome: 'ADM' }
]

async function carregarPerguntas() {
    const tbody = document.getElementById('perguntas-table-body')
    if (!tbody) return
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">Carregando...</td></tr>'

    try {
        const response = await fetch(`${API_BASE}/perguntas`, { headers: authHeaders() })
        if (!response.ok) throw new Error()
        const perguntas = await response.json()

        tbody.innerHTML = ''
        if (perguntas.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">Nenhuma pergunta cadastrada.</td></tr>'
            return
        }

        perguntas.forEach(p => {
            const tr = document.createElement('tr')
            tr.innerHTML = `
        <td>${p.id}</td>
        <td>${p.pergunta}</td>
        <td>${p.respostas ? p.respostas.length : 0} opções</td>
        <td class="acoes">
          <button class="btn-editar" onclick="editarPergunta(${p.id})">Editar</button>
          <button class="btn-excluir" onclick="confirmarExclusaoPergunta(${p.id})">Excluir</button>
        </td>
      `
            tbody.appendChild(tr)
        })
    } catch (error) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; color:red;">Erro ao carregar perguntas.</td></tr>'
    }
}

function renderizarFormularioRespostas(respostasExistentes = []) {
    const container = document.getElementById('container-respostas')
    container.innerHTML = ''

    const numOpcoes = respostasExistentes.length > 0 ? respostasExistentes.length : 5

    for (let i = 0; i < numOpcoes; i++) {
        const resp = respostasExistentes[i] || { texto: '', pesos: { dev: 1, quimica: 1, logistica: 1, eletronica: 1, adm: 1 } }

        const divBox = document.createElement('div')
        divBox.style.cssText = 'border: 1px solid #ddd; padding: 10px; border-radius: 6px; background: #f9f9f9;'

        let htmlPesos = ''
        CHAVES_CURSOS.forEach(c => {
            const val = (resp.pesos && resp.pesos[c.chave] !== undefined) ? resp.pesos[c.chave] : 1
            htmlPesos += `
        <label style="font-size:11px; margin-right:4px; display:inline-block; margin-top:3px;">
          ${c.nome}: 
          <input type="number" min="0" max="3" class="input-peso" data-curso="${c.chave}" value="${val}" style="width: 38px; padding:2px;">
        </label>
      `
        })

        divBox.innerHTML = `
      <div class="form-group" style="margin-bottom: 5px;">
        <label><b>Opção ${i + 1}:</b></label>
        <input type="text" class="input-resposta-texto" value="${resp.texto}" placeholder="Texto da alternativa" required style="width:100%;">
      </div>
      <div style="margin-top: 5px; display: flex; flex-wrap: wrap; gap: 2px; align-items: center;">
        <span style="font-size:11px; font-weight:bold; width: 100%;">Pesos:</span> ${htmlPesos}
      </div>
    `
        container.appendChild(divBox)
    }
}

function abrirModalPergunta(pergunta = null) {
    document.getElementById('modal-pergunta').style.display = 'flex'
    if (pergunta) {
        document.getElementById('modal-pergunta-titulo').textContent = 'Editar Pergunta'
        document.getElementById('pergunta-id').value = pergunta.id
        document.getElementById('pergunta-texto').value = pergunta.pergunta
        renderizarFormularioRespostas(pergunta.respostas)
    } else {
        document.getElementById('modal-pergunta-titulo').textContent = 'Nova Pergunta'
        document.getElementById('form-pergunta').reset()
        document.getElementById('pergunta-id').value = ''
        renderizarFormularioRespostas()
    }
}

function fecharModalPergunta() {
    document.getElementById('modal-pergunta').style.display = 'none'
}

async function editarPergunta(id) {
    try {
        const response = await fetch(`${API_BASE}/perguntas`, { headers: authHeaders() })
        const perguntas = await response.json()
        const pergunta = perguntas.find(p => p.id === id)
        if (pergunta) abrirModalPergunta(pergunta)
    } catch (error) {
        mostrarMensagem('teste-mensagem', 'Erro ao carregar pergunta para edição.', 'erro')
    }
}

function confirmarExclusaoPergunta(id) {
    itemParaExcluir = id
    tipoExclusao = 'pergunta'
    document.getElementById('modal-confirmacao').style.display = 'flex'
}

async function excluirPergunta(id) {
    try {
        const response = await fetch(`${API_BASE}/perguntas/${id}`, {
            method: 'DELETE',
            headers: authHeaders()
        })
        if (!response.ok) throw new Error()
        await carregarPerguntas()
        mostrarMensagem('teste-mensagem', 'Pergunta excluída com sucesso!', 'sucesso')
    } catch (error) {
        mostrarMensagem('teste-mensagem', 'Erro ao excluir pergunta.', 'erro')
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const formPergunta = document.getElementById('form-pergunta')
    if (formPergunta) {
        formPergunta.addEventListener('submit', async function (e) {
            e.preventDefault()
            const id = document.getElementById('pergunta-id').value
            const textoPergunta = document.getElementById('pergunta-texto').value.trim()

            const blocosRespostas = document.querySelectorAll('#container-respostas > div')
            const respostas = []

            blocosRespostas.forEach(bloco => {
                const texto = bloco.querySelector('.input-resposta-texto').value.trim()
                const inputsPesos = bloco.querySelectorAll('.input-peso')
                const pesos = {}

                inputsPesos.forEach(inp => {
                    pesos[inp.dataset.curso] = parseInt(inp.value) || 0
                })

                if (texto) {
                    respostas.push({ texto, pesos })
                }
            })

            const payload = { pergunta: textoPergunta, respostas }

            try {
                const url = id ? `${API_BASE}/perguntas/${id}` : `${API_BASE}/perguntas`
                const method = id ? 'PUT' : 'POST'

                const response = await fetch(url, {
                    method,
                    headers: authHeaders(),
                    body: JSON.stringify(payload)
                })

                if (!response.ok) throw new Error()

                await carregarPerguntas()
                fecharModalPergunta()
                mostrarMensagem('teste-mensagem', id ? 'Pergunta atualizada!' : 'Pergunta cadastrada!', 'sucesso')
            } catch (error) {
                mostrarMensagem('teste-mensagem', 'Erro ao salvar pergunta.', 'erro')
            }
        })
    }
})