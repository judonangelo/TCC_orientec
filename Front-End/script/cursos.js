// area de configuracao
window.API_BASE = `http://${window.location.hostname}:3000`

// area de cursos
async function carregarCursos() {
    const grid = document.getElementById('cursos-grid')

    try {
        const response = await fetch(`${API_BASE}/cursos`)

        if (!response.ok) {
            throw new Error(`Erro ao buscar cursos: ${response.status}`)
        }

        const cursos = await response.json()
        const cursosAtivos = cursos.filter(c => c.status === "ativo")

        if (cursosAtivos.length === 0) {
            grid.innerHTML = '<p class="sem-cursos">Nenhum curso ativo no momento.</p>'
            return
        }

        grid.innerHTML = cursosAtivos.map(curso => {


            return `
                <div class="curso-card" id="curso-${curso.id}">
                    <h3>${curso.nome}</h3>
                    <p class="curso-desc">${curso.resumo}</p>
                    <p class="curso-duracao">Duração: ${curso.duracao} semestres</p>
                    <p class="curso-area">Áreas: ${curso.area}</p>
                    <button class="btn-saiba-mais" data-id="${curso.id}">Saiba mais</button>
                </div>
            `
        }).join('')

        document.querySelectorAll('.btn-saiba-mais').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id')
                window.location.href = `saiba-mais.html?id=${id}`
            })
        })

        destacarCursoDoHash()

    } catch (error) {
        console.error(error)
        grid.innerHTML = '<p class="sem-cursos">Erro ao carregar cursos. Tente novamente mais tarde.</p>'
    }
}

function destacarCursoDoHash() {
    if (!window.location.hash) return

    const el = document.querySelector(window.location.hash)
    if (!el) return

    setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        el.classList.add('curso-destacado')
        setTimeout(() => el.classList.remove('curso-destacado'), 3000)
    }, 120)
}

window.addEventListener('hashchange', destacarCursoDoHash)

carregarCursos()