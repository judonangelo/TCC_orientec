// area de configuracao
window.API_BASE = `http://${window.location.hostname}:3000`

// area de cursos
async function carregarCursoPorId(id) {
    const container = document.getElementById('conteudo-curso')

    try {
        const response = await fetch(`${API_BASE}/cursos/${id}`)

        if (response.status === 404) {
            container.innerHTML = `
                <div class="erro-card">
                    <h2>Curso não encontrado</h2>
                    <p>O curso que você procura não existe ou foi removido.</p>
                    <button class="btn-voltar" onclick="history.back()">← Voltar para Cursos</button>
                </div>
            `
            return
        }

        if (!response.ok) {
            throw new Error(`Erro ao buscar curso: ${response.status}`)
        }

        const curso = await response.json()

        const tags = (curso.tags || [])
            .filter(t => Number(t.peso) > 0)
            .sort((a, b) => Number(b.peso) - Number(a.peso))

        const badges = tags
            .map(t => `<span class="tag-badge" title="Peso ${t.peso}">${t.nome}</span>`)
            .join('')

        container.innerHTML = `
            <h1>${curso.nome}</h1>
            ${badges ? `<div class="curso-tags">${badges}</div>` : ''}

            <div class="info-grid">
                <div class="info-item"><strong>Duração:</strong> ${curso.duracao} semestres</div>
                <div class="info-item"><strong>Faixa salarial:</strong> ${curso.salario || '—'}</div>
                <div class="info-item"><strong>Carga Horária:</strong> ${curso.carga_horaria || '—'}</div>
            </div>

            <div class="secao destaque">
                <h3>Descrição</h3>
                <p>${curso.descricao}</p>
            </div>
            <div class="secao">
                <h3>Mercado de Trabalho</h3>
                <p>${curso.mercado || '—'}</p>
            </div>
            <div class="secao">
                <h3>Perfil do Aluno</h3>
                <p>${curso.perfil || '—'}</p>
            </div>
        `

    } catch (error) {
        console.error(error)
        container.innerHTML = `
            <div class="erro-card">
                <h2>Erro ao carregar curso</h2>
                <p>Não foi possível buscar os dados. Tente novamente mais tarde.</p>
                <button class="btn-voltar" onclick="history.back()">← Voltar para Cursos</button>
            </div>
        `
    }
}

const urlParams = new URLSearchParams(window.location.search)
const id = urlParams.get('id')
const container = document.getElementById('conteudo-curso')

if (!id) {
    container.innerHTML = `
        <div class="erro-card">
            <h2>Curso não encontrado</h2>
            <p>Nenhum curso foi selecionado.</p>
            <button class="btn-voltar" onclick="history.back()">← Voltar para Cursos</button>
        </div>
    `
} else {
    carregarCursoPorId(id)
}