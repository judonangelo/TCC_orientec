// ============================================
// VERIFICAÇÃO DE AUTENTICAÇÃO CENTRALIZADA
// ============================================
// Uso:
//   - Em páginas que exigem login, inclua este script.
//   - Defina a variável `nivelNecessario` antes de carregar este script:
//        <script>var nivelNecessario = "admin";</script>   (ou "aluno")
//   - Se a página for apenas para autenticados (qualquer nível), use: nivelNecessario = "any"

(function() {
    // Oculta o corpo imediatamente para evitar flash de conteúdo
    document.body.style.display = "none";

    const token = localStorage.getItem("tokenIntranet");
    const nivelUsuario = localStorage.getItem("nivelUsuario");

    function bloquearAcesso(mensagem, destino) {
        alert(mensagem);
        // Limpa dados inválidos
        localStorage.removeItem("tokenIntranet");
        localStorage.removeItem("nivelUsuario");
        localStorage.removeItem("emailUsuario");
        localStorage.removeItem("nomeUsuario");
        window.location.href = destino;
        throw new Error(mensagem);
    }

    // 1. Token existe?
    if (!token) {
        bloquearAcesso("Acesso Negado! Faça login para continuar.", "index.html");
    }

    // 2. Verifica nível se necessário
    if (typeof nivelNecessario !== "undefined" && nivelNecessario !== "any") {
        if (!nivelUsuario) {
            bloquearAcesso("Sessão inválida. Faça login novamente.", "index.html");
        }
        if (nivelUsuario !== nivelNecessario) {
            // Redireciona para a área correta
            const destino = (nivelUsuario === "admin") ? "dashboard.html" : "home.html";
            bloquearAcesso(`Acesso negado. Área restrita a ${nivelNecessario}s.`, destino);
        }
    }

    // 3. Tudo ok – revela a página
    document.body.style.display = "";
})();