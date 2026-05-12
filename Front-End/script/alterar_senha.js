    const API_BASE = 'http://localhost:3000';

    document.getElementById('formTrocarSenha').addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const novaSenha = document.getElementById('novaSenha').value;
        const confirmarSenha = document.getElementById('confirmarSenha').value;

        if (!email || !novaSenha || !confirmarSenha) {
            alert('Preencha todos os campos.');
            return;
        }
        if (novaSenha.length < 6) {
            alert('A nova senha deve ter no mínimo 6 caracteres.');
            return;
        }
        if (novaSenha !== confirmarSenha) {
            alert('As senhas não coincidem.');
            return;
        }

        try {
            const resposta = await fetch(`${API_BASE}/trocar_senha`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, senha: novaSenha })
            });

            const dados = await resposta.json();

            if (resposta.ok) {
                alert(dados.mensagem || 'Senha alterada com sucesso!');
                document.getElementById('formTrocarSenha').reset();
            } else {
                alert(dados.mensagem || 'Erro ao alterar senha.');
            }
        } catch (erro) {
            alert('Erro de conexão com o servidor.');
            console.error(erro);
        }
    });