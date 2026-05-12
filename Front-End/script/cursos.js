        const API_BASE = "http://localhost:3000";

        async function carregarCursos() {
            const grid = document.getElementById('cursos-grid');

            try {
                const response = await fetch(`${API_BASE}/cursos`);

                if (!response.ok) {
                    throw new Error(`Erro ao buscar cursos: ${response.status}`);
                }

                const cursos = await response.json();

                const cursosAtivos = cursos.filter(c => c.status === "ativo");

                if (cursosAtivos.length === 0) {
                    grid.innerHTML = '<p class="sem-cursos">Nenhum curso ativo no momento.</p>';
                    return;
                }

                grid.innerHTML = cursosAtivos.map(curso => `
                    <div class="curso-card">
                        <h3>${curso.nome}</h3>
                        <p class="curso-desc">${curso.resumo}</p>
                        <p class="curso-duracao">Duração: ${curso.duracao} semestres</p>
                        <p class="curso-area">Áreas: ${curso.area}</p>
                        <button class="btn-saiba-mais" data-id="${curso.id}">Saiba mais</button>
                    </div>
                `).join('');

                document.querySelectorAll('.btn-saiba-mais').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const id = btn.getAttribute('data-id');
                        window.location.href = `saiba-mais.html?id=${id}`;
                    });
                });

            } catch (error) {
                console.error(error);
                grid.innerHTML = '<p class="sem-cursos">Erro ao carregar cursos. Tente novamente mais tarde.</p>';
            }
        }

        carregarCursos();