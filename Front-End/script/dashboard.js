// area de configuracao
window.API_BASE = `http://${window.location.hostname}:3000`

const token = localStorage.getItem("tokenIntranet")

const authHeaders = () => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
})


let usuariosGlobal = []
let paginaAtual = 1
const ITENS_POR_PAGINA = 10
let termoPesquisa = ''
let filtroNivel = 'todos'
let tagsGlobais = []
let tagsPromise = null

// area de navegacao
document.querySelectorAll('.sidebar-link').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault()
        document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'))
        this.classList.add('active')
        const section = this.dataset.section
        document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'))
        document.getElementById(`${section}-section`).classList.add('active')

        if (section === 'relatorios') carregarRelatorios()
        if (section === 'cursos') carregarCursos()
        if (section === 'tags') carregarTabelaTags()
        if (section === 'teste') carregarPerguntas()
    })
})

// area de tags
async function carregarTagsGlobais() {
    try {
        const response = await fetch(`${API_BASE}/tags`, { headers: authHeaders() })
        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`)
        tagsGlobais = await response.json()
        return tagsGlobais
    } catch (error) {
        console.error("Erro ao carregar tags:", error)
        tagsGlobais = []
        return []
    }
}

// area de usuarios
function renderizarUsuarios(usuarios) {
    const tbody = document.getElementById('usuarios-table-body')
    tbody.innerHTML = ''

    const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA
    const fim = inicio + ITENS_POR_PAGINA
    const paginaUsuarios = usuarios.slice(inicio, fim)

    if (paginaUsuarios.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;">Nenhum usuário encontrado.</td></tr>'
    } else {
        paginaUsuarios.forEach(usuario => {
            const tr = document.createElement('tr')
            tr.innerHTML = `
                <td>${usuario.id}</td>
                <td>${usuario.nome}</td>
                <td>${usuario.email}</td>
                <td>${usuario.cpf}</td>
                <td>${usuario.nivel}</td>
                <td>${usuario.data}</td>
                <td class="acoes">
                    <button class="btn-editar" onclick="abrirModalEditarUsuario(${usuario.id}, '${usuario.nivel}')">Editar</button>
                    <button class="btn-excluir" onclick="confirmarExclusaoUsuario(${usuario.id})">Excluir</button>
                </td>
            `
            tbody.appendChild(tr)
        })
    }

    atualizarControlesPaginacao(usuarios.length)
}

function atualizarControlesPaginacao(totalItens) {
    const container = document.getElementById('paginacao-container')
    if (!container) return

    const totalPaginas = Math.ceil(totalItens / ITENS_POR_PAGINA)
    container.innerHTML = ''

    if (totalPaginas <= 1) return

    const btnAnterior = document.createElement('button')
    btnAnterior.textContent = '← Anterior'
    btnAnterior.className = 'btn-paginacao btn-anterior'
    btnAnterior.disabled = paginaAtual === 1
    btnAnterior.addEventListener('click', () => {
        if (paginaAtual > 1) {
            paginaAtual--
            aplicarFiltros()
        }
    })
    container.appendChild(btnAnterior)

    const spanPagina = document.createElement('span')
    spanPagina.textContent = ` Página ${paginaAtual} de ${totalPaginas} `
    spanPagina.style.margin = '0 10px'
    container.appendChild(spanPagina)

    const btnProximo = document.createElement('button')
    btnProximo.textContent = 'Próximo →'
    btnProximo.className = 'btn-paginacao btn-proximo'
    btnProximo.disabled = paginaAtual === totalPaginas
    btnProximo.addEventListener('click', () => {
        if (paginaAtual < totalPaginas) {
            paginaAtual++
            aplicarFiltros()
        }
    })
    container.appendChild(btnProximo)
}

function aplicarFiltros() {
    const termo = termoPesquisa.toLowerCase()
    const filtrados = usuariosGlobal.filter(usuario => {

        const matchNome = usuario.nome.toLowerCase().startsWith(termo)
        if (!matchNome) return false

        if (filtroNivel === 'todos') return true
        return usuario.nivel === filtroNivel
    })
    renderizarUsuarios(filtrados)
}

function atualizarUsuariosFiltrados() {
    paginaAtual = 1
    aplicarFiltros()
}

const pesquisaInput = document.getElementById('pesquisa-nome')
if (pesquisaInput) {
    pesquisaInput.addEventListener('input', function (e) {
        termoPesquisa = e.target.value.trim()
        atualizarUsuariosFiltrados()
    })
}

const filtroSelect = document.getElementById('filtro-tipo-usuario')
if (filtroSelect) {
    filtroSelect.addEventListener('change', function (e) {
        filtroNivel = e.target.value
        atualizarUsuariosFiltrados()
    })
}

async function carregarUsuarios() {
    const tbody = document.getElementById('usuarios-table-body')
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Carregando...</td></tr>'

    try {
        const response = await fetch(`${API_BASE}/usuarios`, { headers: authHeaders() })
        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                logout()
                return
            }
            throw new Error(`Erro HTTP: ${response.status}`)
        }
        const usuarios = await response.json()
        usuariosGlobal = usuarios
        paginaAtual = 1
        termoPesquisa = ''
        filtroNivel = 'todos'
        if (pesquisaInput) pesquisaInput.value = ''
        if (filtroSelect) filtroSelect.value = 'todos'

        atualizarUsuariosFiltrados()

        carregarRelatorios()
    } catch (error) {
        console.error("Erro ao carregar usuários:", error)
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:red;">Erro ao carregar usuários.</td></tr>'
    }
}

// area de usuarios - editar
const formEditar = document.getElementById('form-editar-usuario')
if (formEditar) {
    formEditar.addEventListener('submit', async function (e) {
        e.preventDefault()
        const id = document.getElementById('editar-usuario-id').value
        const payload = {
            nivel: document.getElementById('editar-usuario-nivel').value,
        }

        try {
            const response = await fetch(`${API_BASE}/usuarios/${id}`, {
                method: 'PUT',
                headers: authHeaders(),
                body: JSON.stringify(payload)
            })
            const dados = await response.json()
            if (!response.ok) throw new Error(dados.mensagem || 'Erro ao atualizar')
            await carregarUsuarios()
            fecharModalEditarUsuario()
            mostrarMensagem('editar-usuario-mensagem', dados.mensagem, 'sucesso')
        } catch (erro) {
            mostrarMensagem('editar-usuario-mensagem', `Erro: ${erro.message}`, 'erro')
        }
    })
}

function abrirModalEditarUsuario(id, nivel) {
    document.getElementById('editar-usuario-id').value = id
    document.getElementById('editar-usuario-nivel').value = nivel
    document.getElementById('modal-editar-usuario').style.display = 'flex'
}

function fecharModalEditarUsuario() {
    document.getElementById('modal-editar-usuario').style.display = 'none'
}

// area de usuarios - excluir
let itemParaExcluir = null
let tipoExclusao = null

function confirmarExclusaoUsuario(id) {
    itemParaExcluir = id
    tipoExclusao = 'usuario'
    document.getElementById('modal-confirmacao').style.display = 'flex'
}

async function excluirUsuario(id) {
    try {
        const response = await fetch(`${API_BASE}/usuarios/${id}`, {
            method: 'DELETE',
            headers: authHeaders()
        })
        const dados = await response.json()
        if (!response.ok) throw new Error(dados.mensagem || 'Erro ao excluir')
        await carregarUsuarios()
        mostrarMensagem('usuarios-mensagem', dados.mensagem, 'sucesso')
    } catch (erro) {
        mostrarMensagem('usuarios-mensagem', `Erro: ${erro.message}`, 'erro')
    }
}

// area de cursos
async function carregarCursos() {
    const tbody = document.getElementById('cursos-table-body')
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Carregando...</td></tr>'

    try {
        const response = await fetch(`${API_BASE}/cursos`, { headers: authHeaders() })
        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`)
        const cursos = await response.json()

        tbody.innerHTML = ''
        if (cursos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Nenhum curso cadastrado.</td></tr>'
            carregarRelatorios()
            return
        }

        cursos.forEach(curso => {
            const tr = document.createElement('tr')
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
            `
            tbody.appendChild(tr)
        })

        carregarRelatorios()
    } catch (error) {
        console.error("Erro ao carregar cursos:", error)
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:red;">Erro ao carregar cursos.</td></tr>'
    }
}

// area de cursos - tags
function renderizarLinhasTags(tagsDoCurso = []) {
    const container = document.getElementById('curso-tags-container')
    if (!container) return
    container.innerHTML = ''

    if (tagsDoCurso.length === 0) {
        adicionarLinhaTag()
    } else {
        tagsDoCurso.forEach(t => adicionarLinhaTag(t.tag_id, t.peso))
    }
}

function adicionarLinhaTag(tagId = '', peso = 1) {
    const container = document.getElementById('curso-tags-container')
    if (!container) return

    const div = document.createElement('div')
    div.className = 'tag-row'
    div.style.cssText = 'display: flex; gap: 8px; align-items: center; margin-bottom: 8px;'

    const options = tagsGlobais.map(t =>
        `<option value="${t.id}" ${String(t.id) === String(tagId) ? 'selected' : ''}>${t.nome}</option>`
    ).join('')

    div.innerHTML = `
        <select class="input-tag-id"
            style="flex: 2; padding: 8px; border: 1px solid #ddd; border-radius: 6px;">
            <option value="">Selecione uma tag...</option>
            ${options}
        </select>
        <input type="number" class="input-tag-peso" min="0" max="3" value="${peso}"
            title="Peso de 0 a 3"
            style="width: 80px; padding: 8px; border: 1px solid #ddd; border-radius: 6px;">
        <button type="button" class="btn-excluir" onclick="removerLinhaTag(this)"
            style="padding: 8px 12px; cursor: pointer;">×</button>
    `
    container.appendChild(div)
}

function removerLinhaTag(botao) {
    const container = document.getElementById('curso-tags-container')
    botao.parentElement.remove()

    if (container && container.querySelectorAll('.tag-row').length === 0) {
        adicionarLinhaTag()
    }
}

function coletarTagsDoFormulario() {
    const linhas = document.querySelectorAll('#curso-tags-container .tag-row')
    const tags = []
    const vistos = new Set()

    linhas.forEach(linha => {
        const tagId = parseInt(linha.querySelector('.input-tag-id').value)
        const peso = parseInt(linha.querySelector('.input-tag-peso').value)

        if (!tagId || vistos.has(tagId)) return
        vistos.add(tagId)

        tags.push({
            tag_id: tagId,
            peso: Math.max(0, Math.min(3, isNaN(peso) ? 0 : peso))
        })
    })

    return tags
}

// area de cursos - modal
async function abrirModalCurso(curso = null) {
    if (tagsGlobais.length === 0 && tagsPromise) {
        await tagsPromise
    }

    document.getElementById('modal-curso').style.display = 'flex'

    if (curso) {
        document.getElementById('modal-curso-titulo').textContent = 'Editar Curso'
        document.getElementById('curso-id').value = curso.id
        document.getElementById('curso-nome').value = curso.nome
        document.getElementById('curso-duracao').value = curso.duracao
        document.getElementById('curso-vagas').value = curso.vagas ?? ''
        document.getElementById('curso-descricao').value = curso.descricao ?? ''
        document.getElementById('curso-area').value = curso.area ?? ''
        document.getElementById('curso-resumo').value = curso.resumo ?? ''
        document.getElementById('curso-carga-horaria').value = curso.carga_horaria ?? ''
        document.getElementById('curso-salario').value = curso.salario ?? ''
        document.getElementById('curso-mercado').value = curso.mercado ?? ''
        document.getElementById('curso-perfil').value = curso.perfil ?? ''
        document.getElementById('curso-status').value = curso.status
        renderizarLinhasTags(curso.tags || [])
    } else {
        document.getElementById('modal-curso-titulo').textContent = 'Novo Curso'
        document.getElementById('form-curso').reset()
        document.getElementById('curso-id').value = ''
        renderizarLinhasTags([])
    }
}

function fecharModalCurso() {
    document.getElementById('modal-curso').style.display = 'none'
}

async function editarCurso(id) {
    try {
        const response = await fetch(`${API_BASE}/cursos/${id}`, { headers: authHeaders() })
        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`)
        const curso = await response.json()
        abrirModalCurso(curso)
    } catch (error) {
        console.error("Erro ao buscar curso para edição:", error)
        mostrarMensagem('cursos-mensagem', 'Erro ao carregar dados do curso.', 'erro')
    }
}

function confirmarExclusaoCurso(id) {
    itemParaExcluir = id
    tipoExclusao = 'curso'
    document.getElementById('modal-confirmacao').style.display = 'flex'
}

async function excluirCurso(id) {
    try {
        const response = await fetch(`${API_BASE}/cursos/${id}`, {
            method: 'DELETE',
            headers: authHeaders()
        })
        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`)
        await carregarCursos()
        mostrarMensagem('cursos-mensagem', 'Curso excluído com sucesso!', 'sucesso')
    } catch (error) {
        console.error("Erro ao excluir curso:", error)
        mostrarMensagem('cursos-mensagem', 'Erro ao excluir curso.', 'erro')
    }
}

// area de cursos - confirmacao de exclusao
const btnConfirmar = document.getElementById('btn-confirmar-exclusao')
if (btnConfirmar) {
    btnConfirmar.addEventListener('click', async function () {
        if (tipoExclusao === 'usuario') excluirUsuario(itemParaExcluir)
        else if (tipoExclusao === 'curso') await excluirCurso(itemParaExcluir)
        else if (tipoExclusao === 'pergunta') await excluirPergunta(itemParaExcluir)
        else if (tipoExclusao === 'tag') await excluirTag(itemParaExcluir)
        fecharModalConfirmacao()
    })
}

function fecharModalConfirmacao() {
    document.getElementById('modal-confirmacao').style.display = 'none'
    itemParaExcluir = null
    tipoExclusao = null
}

// area de cursos - formulario
const formCurso = document.getElementById('form-curso')
if (formCurso) {
    formCurso.addEventListener('submit', async function (e) {
        e.preventDefault()

        const id = document.getElementById('curso-id').value

        const tagsSelecionadas = coletarTagsDoFormulario()
        if (tagsSelecionadas.length === 0) {
            mostrarMensagem('cursos-mensagem', 'Selecione pelo menos uma tag para o curso.', 'erro')
            return
        }

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
            perfil: document.getElementById('curso-perfil').value.trim() || null,
            tags: tagsSelecionadas
        }

        try {
            let response
            if (id) {
                response = await fetch(`${API_BASE}/cursos/${id}`, {
                    method: 'PUT',
                    headers: authHeaders(),
                    body: JSON.stringify(payload)
                })
            } else {
                response = await fetch(`${API_BASE}/cursos`, {
                    method: 'POST',
                    headers: authHeaders(),
                    body: JSON.stringify(payload)
                })
            }

            if (!response.ok) {
                const erro = await response.json()
                throw new Error(erro.mensagem || `Erro HTTP: ${response.status}`)
            }

            await carregarCursos()
            fecharModalCurso()
            mostrarMensagem(
                'cursos-mensagem',
                id ? 'Curso atualizado com sucesso!' : 'Curso cadastrado com sucesso!',
                'sucesso'
            )
        } catch (error) {
            console.error("Erro ao salvar curso:", error)
            mostrarMensagem('cursos-mensagem', `Erro: ${error.message}`, 'erro')
        }
    })
}

// area de tags
async function carregarTabelaTags() {
    const tbody = document.getElementById('tags-table-body')
    if (!tbody) return
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Carregando...</td></tr>'

    try {
        const response = await fetch(`${API_BASE}/tags/todas`, { headers: authHeaders() })
        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`)
        const tags = await response.json()

        tbody.innerHTML = ''
        if (tags.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Nenhuma tag cadastrada.</td></tr>'
            return
        }

        tags.forEach(tag => {
            const tr = document.createElement('tr')
            tr.innerHTML = `
                <td>${tag.id}</td>
                <td>${tag.chave}</td>
                <td>${tag.nome}</td>
                <td>${tag.descricao || '—'}</td>
                <td><span class="status status-${tag.ativo ? 'ativo' : 'inativo'}">${tag.ativo ? 'Ativa' : 'Inativa'}</span></td>
                <td class="acoes">
                    <button class="btn-editar" onclick="editarTag(${tag.id})">Editar</button>
                    <button class="btn-excluir" onclick="confirmarExclusaoTag(${tag.id})">Excluir</button>
                </td>
            `
            tbody.appendChild(tr)
        })
    } catch (error) {
        console.error("Erro ao carregar tags:", error)
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:red;">Erro ao carregar tags.</td></tr>'
    }
}

function abrirModalTag(tag = null) {
    document.getElementById('modal-tag').style.display = 'flex'
    if (tag) {
        document.getElementById('modal-tag-titulo').textContent = 'Editar Tag'
        document.getElementById('tag-id').value = tag.id
        document.getElementById('tag-chave').value = tag.chave
        document.getElementById('tag-nome').value = tag.nome
        document.getElementById('tag-descricao').value = tag.descricao || ''
        document.getElementById('tag-ativo').value = tag.ativo ? '1' : '0'
    } else {
        document.getElementById('modal-tag-titulo').textContent = 'Nova Tag'
        document.getElementById('form-tag').reset()
        document.getElementById('tag-id').value = ''
    }
}

function fecharModalTag() {
    document.getElementById('modal-tag').style.display = 'none'
}

async function editarTag(id) {
    try {
        const response = await fetch(`${API_BASE}/tags/todas`, { headers: authHeaders() })
        const tags = await response.json()
        const tag = tags.find(t => t.id === id)
        if (tag) abrirModalTag(tag)
    } catch (error) {
        mostrarMensagem('tags-mensagem', 'Erro ao carregar tag para edição.', 'erro')
    }
}

function confirmarExclusaoTag(id) {
    itemParaExcluir = id
    tipoExclusao = 'tag'
    document.getElementById('modal-confirmacao').style.display = 'flex'
}

async function excluirTag(id) {
    try {
        const response = await fetch(`${API_BASE}/tags/${id}`, {
            method: 'DELETE',
            headers: authHeaders()
        })
        if (!response.ok) throw new Error()
        await carregarTabelaTags()
        await carregarTagsGlobais() // recarrega o cache global que alimenta os seletores
        mostrarMensagem('tags-mensagem', 'Tag excluída com sucesso!', 'sucesso')
    } catch (error) {
        mostrarMensagem('tags-mensagem', 'Erro ao excluir tag.', 'erro')
    }
}

// area de tags - formulario
const formTag = document.getElementById('form-tag')
if (formTag) {
    formTag.addEventListener('submit', async function (e) {
        e.preventDefault()
        const id = document.getElementById('tag-id').value
        const payload = {
            chave: document.getElementById('tag-chave').value.trim(),
            nome: document.getElementById('tag-nome').value.trim(),
            descricao: document.getElementById('tag-descricao').value.trim() || null,
            ativo: parseInt(document.getElementById('tag-ativo').value)
        }

        try {
            let response
            if (id) {
                response = await fetch(`${API_BASE}/tags/${id}`, {
                    method: 'PUT',
                    headers: authHeaders(),
                    body: JSON.stringify(payload)
                })
            } else {
                response = await fetch(`${API_BASE}/tags`, {
                    method: 'POST',
                    headers: authHeaders(),
                    body: JSON.stringify(payload)
                })
            }

            const dados = await response.json()
            if (!response.ok) throw new Error(dados.mensagem || 'Erro ao salvar tag')

            await carregarTabelaTags()
            await carregarTagsGlobais() // recarrega o cache global
            fecharModalTag()
            mostrarMensagem('tags-mensagem', id ? 'Tag atualizada com sucesso!' : 'Tag criada com sucesso!', 'sucesso')
        } catch (error) {
            mostrarMensagem('tags-mensagem', `Erro: ${error.message}`, 'erro')
        }
    })
}

// area de tags - filtro de caracteres
const inputTagChave = document.getElementById('tag-chave')
if (inputTagChave) {
    inputTagChave.addEventListener('input', function (e) {
        this.value = this.value.toLowerCase().replace(/[^a-z0-9_]/g, '')
    })
}

// area de relatorios
async function carregarRelatorios() {
    try {
        const response = await fetch(`${API_BASE}/relatorios`, { headers: authHeaders() })
        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`)
        const stats = await response.json()

        document.getElementById('total-usuarios').textContent = stats.totalUsuarios
        document.getElementById('total-cursos').textContent = stats.totalCursos
        document.getElementById('cursos-ativos').textContent = stats.cursosAtivos
    } catch (error) {
        console.error("Erro ao carregar relatórios:", error)
    }
}

// area de utilitarios
function mostrarMensagem(elementoId, texto, tipo) {
    const elemento = document.getElementById(elementoId)
    if (!elemento) return

    elemento.textContent = texto
    elemento.className = `mensagem ${tipo}`

    elemento.scrollIntoView({ behavior: 'smooth', block: 'center' })
    
    setTimeout(() => {
        elemento.className = 'mensagem'
        elemento.textContent = ''
    }, 3000)
}

function logout() {
    if (confirm('Tem certeza que deseja sair?')) {
        localStorage.removeItem("emailUsuario")
        localStorage.removeItem("tokenIntranet")
        localStorage.removeItem("nomeUsuario")
        localStorage.removeItem("nivelUsuario")
        window.location.href = '../index.html'
    }
}

// area de inicializacao
tagsPromise = carregarTagsGlobais()
tagsPromise.then(() => {
    carregarUsuarios()
    carregarCursos()
})

window.addEventListener('click', function (e) {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none'
    }
})

// area do teste vocacional - perguntas
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

// area do teste vocacional - formulario de respostas
function adicionarLinhaPeso(container, chave = '', peso = 0) {
    const div = document.createElement('div')
    div.className = 'peso-row'
    div.style.cssText = 'display: flex; gap: 8px; margin-bottom: 5px; align-items: center;'

    const options = tagsGlobais.map(t =>
        `<option value="${t.chave}" ${t.chave === chave ? 'selected' : ''}>${t.nome}</option>`
    ).join('')

    div.innerHTML = `
        <select class="input-peso-tag" style="flex: 1; padding: 6px; border: 1px solid #ddd; border-radius: 4px; font-size: 13px;">
            <option value="">Selecione a tag...</option>
            ${options}
        </select>
        <input type="number" class="input-peso-valor" min="0" max="3" value="${peso}" title="Peso (0 a 3)" 
            style="width: 65px; padding: 6px; border: 1px solid #ddd; border-radius: 4px; font-size: 13px;">
        <button type="button" class="btn-excluir" onclick="this.parentElement.remove()" style="padding: 6px 10px;">×</button>
    `
    container.appendChild(div)
}

function renderizarFormularioRespostas(respostasExistentes = []) {
    const container = document.getElementById('container-respostas')
    if (!container) return
    container.innerHTML = ''

    const numOpcoes = respostasExistentes.length > 0 ? respostasExistentes.length : 5

    for (let i = 0; i < numOpcoes; i++) {
        const resp = respostasExistentes[i] || { texto: '', pesos: {} }

        const divBox = document.createElement('div')
        divBox.style.cssText = 'border: 1px solid #ddd; padding: 10px; border-radius: 6px; background: #f9f9f9;'

        divBox.innerHTML = `
            <div class="form-group" style="margin-bottom: 8px;">
                <label><b>Alternativa ${i + 1}:</b></label>
                <input type="text" class="input-resposta-texto" value="${resp.texto}"
                    placeholder="Texto da alternativa" required style="width:100%;">
            </div>
            <div class="pesos-container" style="margin-top: 8px;"></div>
            <button type="button" class="btn-secondary" onclick="adicionarLinhaPeso(this.previousElementSibling)" 
                style="margin-top: 6px; font-size: 12px; padding: 4px 10px;">+ Adicionar Peso de Tag</button>
        `

        const pesosContainer = divBox.querySelector('.pesos-container')

        if (resp.pesos) {
            Object.entries(resp.pesos).forEach(([chave, peso]) => {
                if (peso > 0) {
                    adicionarLinhaPeso(pesosContainer, chave, peso)
                }
            })
        }

        container.appendChild(divBox)
    }
}

// area do teste vocacional - modal de pergunta
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

// area do teste vocacional - excluir pergunta
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

// area do teste vocacional - submeter formulario
document.addEventListener('DOMContentLoaded', () => {
    const formPergunta = document.getElementById('form-pergunta')
    if (formPergunta) {
        formPergunta.addEventListener('submit', async function (e) {
            e.preventDefault()
            const id = document.getElementById('pergunta-id').value
            const textoPergunta = document.getElementById('pergunta-texto').value.trim()

            const blocosRespostas = document.querySelectorAll('#container-respostas > div')
            const respostas = []

            let temErroValidacao = false

            blocosRespostas.forEach(bloco => {
                if (temErroValidacao) return

                const texto = bloco.querySelector('.input-resposta-texto').value.trim()
                const rows = bloco.querySelectorAll('.peso-row')
                const pesos = {}

                rows.forEach(row => {
                    const tagChave = row.querySelector('.input-peso-tag').value
                    const pesoValor = parseInt(row.querySelector('.input-peso-valor').value) || 0

                    if (tagChave && pesoValor > 0) {
                        pesos[tagChave] = pesoValor
                    }
                })

                if (texto) {
                    if (Object.keys(pesos).length === 0) {
                        temErroValidacao = true
                        return
                    }
                    respostas.push({ texto, pesos })
                }
            })

            if (temErroValidacao) {
                mostrarMensagem('teste-mensagem', 'Cada alternativa precisa ter pelo menos uma tag com peso de 1 a 3.', 'erro')
                return
            }

            const payload = { pergunta: textoPergunta, respostas }

            try {
                const url = id ? `${API_BASE}/perguntas/${id}` : `${API_BASE}/perguntas`
                const method = id ? 'PUT' : 'POST'

                const response = await fetch(url, {
                    method,
                    headers: authHeaders(),
                    body: JSON.stringify(payload)
                })

                if (!response.ok) {
                    const erro = await response.json()
                    throw new Error(erro.mensagem || 'Erro ao salvar pergunta')
                }

                await carregarPerguntas()
                fecharModalPergunta()
                mostrarMensagem('teste-mensagem', id ? 'Pergunta atualizada!' : 'Pergunta cadastrada!', 'sucesso')
            } catch (error) {
                mostrarMensagem('teste-mensagem', `Erro: ${error.message}`, 'erro')
            }
        })
    }
})