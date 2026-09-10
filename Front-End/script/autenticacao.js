(function() {
    document.body.style.display = "none";

    const token = localStorage.getItem("tokenIntranet");
    const nivelUsuario = localStorage.getItem("nivelUsuario");

    function bloquearAcesso(mensagem, destino) {
        alert(mensagem);
        localStorage.removeItem("tokenIntranet");
        localStorage.removeItem("nivelUsuario");
        localStorage.removeItem("emailUsuario");
        localStorage.removeItem("nomeUsuario");
        window.location.href = destino;
        throw new Error(mensagem);
    }

    if (!token) {
        bloquearAcesso("Acesso Negado! Faça login para continuar.", "index.html");
    }

    if (typeof nivelNecessario !== "undefined" && nivelNecessario !== "any") {
        if (!nivelUsuario) {
            bloquearAcesso("Sessão inválida. Faça login novamente.", "index.html");
        }
        if (nivelUsuario !== nivelNecessario) {
            const destino = (nivelUsuario === "admin") ? "dashboard.html" : "home.html";
            bloquearAcesso(`Acesso negado. Área restrita a ${nivelNecessario}s.`, destino);
        }
    }
    
    document.body.style.display = "";
})();