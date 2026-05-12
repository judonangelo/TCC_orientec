const API_BASE = 'http://localhost:3000';

document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    const mensagemDiv = document.getElementById("mensagem");

    try {
        const resposta = await fetch(`${API_BASE}/login`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, senha })
        });
        const dados = await resposta.json();

        if (resposta.ok && dados.token && dados.nivel === "admin") {
            mensagemDiv.className = "mensagem sucesso";
            mensagemDiv.textContent = "Login realizado com sucesso!";
            localStorage.setItem("tokenIntranet", dados.token);
            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 1000);
        } else if (resposta.ok && dados.token && dados.nivel !== "admin") {
            mensagemDiv.className = "mensagem erro";
            mensagemDiv.textContent = "Acesso restrito apenas a administradores!";
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