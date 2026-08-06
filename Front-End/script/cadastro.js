const API_BASE = 'http://localhost:3000';

const cpfInput = document.getElementById("cpf");

cpfInput.addEventListener("input", (e) => {
    let value = e.target.value.replace(/\D/g, "");

    if (value.length > 11) value = value.slice(0, 11);

    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

    e.target.value = value;
});


document.getElementById("nome").addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, "");
});

document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    const nome = document.getElementById("nome").value;
    const cpf = document.getElementById("cpf").value.replace(/\D/g, "");
    const mensagemDiv = document.getElementById("mensagem");

    try {
        const resposta = await fetch(`${API_BASE}/cadastro`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, senha, nome, cpf })
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