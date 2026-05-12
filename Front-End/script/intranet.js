        document.getElementById("loginForm").addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = document.getElementById("email").value;
            const senha = document.getElementById("senha").value;
            const mensagemDiv = document.getElementById("mensagem");

            try {
                const resposta = await fetch("http://localhost:3000/login", {
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
                    mensagemDiv.textContent = "Login realizado com sucesso!";
                    localStorage.setItem("tokenIntranet", dados.token);
                    setTimeout(() => {
                        window.location.href = "dashboard.html";
                    }, 1000);
                } else {
                    mensagemDiv.className = "mensagem erro";
                    mensagemDiv.textContent = dados.mensagem || "Usuário ou senha incorretos.";
                }
            } catch (erro) {
                mensagemDiv.className = "mensagem erro";
                mensagemDiv.textContent = "Erro de conexão com o servidor.";
                console.error(erro);
            }
        });