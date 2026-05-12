        document.getElementById("loginForm").addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = document.getElementById("email").value;
            const senha = document.getElementById("senha").value;
            const mensagemDiv = document.getElementById("mensagem");

            try {
                const resposta = await fetch("http://localhost:3000/cadastro", {
                    method: "POST",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email, senha })
                });
                const dados = await resposta.json();

                if (resposta.ok) {
                    mensagemDiv.className = "mensagem sucesso";
                    mensagemDiv.textContent = dados.mensagem || "Usuário cadastrado com sucesso!";
                    document.getElementById("loginForm").reset();
                } else {
                    mensagemDiv.className = "mensagem erro";
                    mensagemDiv.textContent = dados.mensagem || "Erro ao cadastrar.";
                }
            } catch (erro) {
                mensagemDiv.className = "mensagem erro";
                mensagemDiv.textContent = "Erro de conexão com o servidor.";
                console.error(erro);
            }
        });