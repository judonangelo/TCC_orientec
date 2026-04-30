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
        // Dados em memória — APENAS USUÁRIOS (ainda não integrado ao banco)
        // ============================================
        let usuarios = [
            { id: 1, nome: "Julia", email: "julia@email.com", perfil: "aluno", data_cadastro: "2024-01-15", status: "ativo" },
            { id: 2, nome: "Joao Victor", email: "joao@email.com", perfil: "admin", data_cadastro: "2026-03-10", status: "ativo" }
        ];
        let proximoIdUsuario = 3;

        // Controle do modal de confirmação de exclusão
        let itemParaExcluir = null;
        let tipoExclusao = null;

        // ============================================
        // Navegação do Sidebar
        // ============================================
        document.querySelectorAll('.sidebar-link').forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                const section = this.dataset.section;
                document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
                document.getElementById(`${section}-section`).classList.add('active');

                // Recarrega relatórios ao entrar na seção
                if (section === 'relatorios') atualizarRelatorios();
                if (section === 'cursos') carregarCursos();
            });
        });

        // ============================================
        // Funções de Usuários — sem alteração
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

            atualizarRelatorios();
        }



        // ============================================
        // CURSOS — CRUD completo integrado ao backend
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
                    atualizarRelatorios(cursos);
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

                atualizarRelatorios(cursos);

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
            document.getElementById('form-curso').reset();
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
                const response = await fetch(`${API_URL}/cursos/${id}`, {
                    method: 'DELETE'
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
        // Modal de Confirmação — despacha para a função certa
        // ============================================
        function fecharModalConfirmacao() {
            document.getElementById('modal-confirmacao').style.display = 'none';
            itemParaExcluir = null;
            tipoExclusao = null;
        }

        document.getElementById('btn-confirmar-exclusao').addEventListener('click', async function () {
            if (tipoExclusao === 'usuario') excluirUsuario(itemParaExcluir);
            else if (tipoExclusao === 'curso') await excluirCurso(itemParaExcluir);
            fecharModalConfirmacao();
        });



        // ============================================
        // SUBMIT — CURSOS (integrado ao backend)
        // ============================================
        document.getElementById('form-curso').addEventListener('submit', async function (e) {
            e.preventDefault();
            const id = document.getElementById('curso-id').value;
            const nome = document.getElementById('curso-nome').value.trim();
            const duracao = parseInt(document.getElementById('curso-duracao').value);
            const vagas = parseInt(document.getElementById('curso-vagas').value);
            const descricao = document.getElementById('curso-descricao').value.trim();
            const status = document.getElementById('curso-status').value;
            const area = document.getElementById('curso-area').value.trim();
            const resumo = document.getElementById('curso-resumo').value.trim();
            const carga_horaria = document.getElementById('curso-carga-horaria').value.trim()
            const salario = document.getElementById('curso-salario').value.trim()
            const mercado = document.getElementById('curso-mercado').value.trim()
            const perfil = document.getElementById('curso-perfil').value.trim()

            const payload = { nome, duracao, vagas, descricao, status, area, resumo, carga_horaria, salario, mercado, perfil };

            try {
                let response;

                if (id) {
                    // Edição — PUT /cursos/:id
                    response = await fetch(`${API_URL}/cursos/${id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });
                } else {
                    // Criação — POST /cursos
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
        // Relatórios — recebe array de cursos para contar
        // ============================================
        function atualizarRelatorios(cursos = []) {
            document.getElementById('total-usuarios').textContent = usuarios.length;
            document.getElementById('total-cursos').textContent = cursos.length;
            document.getElementById('usuarios-ativos').textContent = usuarios.filter(u => u.status === 'ativo').length;
            document.getElementById('cursos-ativos').textContent = cursos.filter(c => c.status === 'ativo').length;
        }

        // ============================================
        // Funções Auxiliares
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
        // Inicialização
        // ============================================
        carregarUsuarios();
        carregarCursos();

        // Fechar modais ao clicar fora
        window.addEventListener('click', function (e) {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });