const API_BASE = 'http://localhost:3000'

document.addEventListener('DOMContentLoaded', () => {
    const tokenLogin = localStorage.getItem('tokenIntranet')

    const groupSenhaAtual = document.getElementById('groupSenhaAtual')
    const groupEmail = document.getElementById('groupEmail')
    const groupCPF = document.getElementById('groupCPF')
    const titulo = document.querySelector('h2')

    groupCPF.addEventListener("input", (e) => {
        let value = e.target.value.replace(/\D/g, "");

        if (value.length > 11) value = value.slice(0, 11);

        value = value.replace(/(\d{3})(\d)/, "$1.$2");
        value = value.replace(/(\d{3})(\d)/, "$1.$2");
        value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

        e.target.value = value;
    });

    if (tokenLogin) {
        titulo.textContent = 'Alterar Senha'
        groupSenhaAtual.style.display = 'block'
        groupEmail.style.display = 'none'
        groupCPF.style.display = 'none'
    } else {
        titulo.textContent = 'Redefinir Senha'
        groupSenhaAtual.style.display = 'none'
        groupEmail.style.display = 'block'
        groupCPF.style.display = 'block'
    }
})

function voltarPagina() {
    const tokenLogin = localStorage.getItem('tokenIntranet')
    window.location.href = tokenLogin ? 'home.html' : 'login.html'
}

document.getElementById('formTrocarSenha').addEventListener('submit', async (e) => {
    e.preventDefault()

    const tokenLogin = localStorage.getItem('tokenIntranet')
    const senhaAtual = document.getElementById('senhaAtual').value
    const email = document.getElementById('email').value.trim()
    const cpf = document.getElementById("cpf").value.replace(/\D/g, "");
    const novaSenha = document.getElementById('novaSenha').value
    const confirmarSenha = document.getElementById('confirmarSenha').value

    if (novaSenha !== confirmarSenha) {
        alert('As senhas não coincidem.')
        return
    }

    try {
        if (tokenLogin) {
            const resposta = await fetch(`${API_BASE}/alterar_senha`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokenLogin}`
                },
                body: JSON.stringify({ senhaAtual, novaSenha })
            })

            const dados = await resposta.json()
            alert(dados.mensagem)

            if (resposta.ok) {
                window.location.href = 'home.html'
            }
        } else {
            if (!email || !cpf) {
                alert('Por favor, preencha o E-mail e o CPF.')
                return
            }

            const resposta = await fetch(`${API_BASE}/redefinir_senha_sem_email`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, cpf, novaSenha })
            })

            const dados = await resposta.json()
            alert(dados.mensagem)

            if (resposta.ok) {
                window.location.href = 'login.html'
            }
        }
    } catch (erro) {
        alert('Erro de conexão com o servidor.')
        console.error(erro)
    }
})