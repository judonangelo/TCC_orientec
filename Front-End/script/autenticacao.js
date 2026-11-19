// area de autenticacao
(function () {
    document.body.style.display = "none"

    const token = localStorage.getItem("tokenIntranet")
    const nivelUsuario = localStorage.getItem("nivelUsuario")

    function bloquearAcesso(mensagem, destino) {
        alert(mensagem)
        localStorage.removeItem("tokenIntranet")
        localStorage.removeItem("nivelUsuario")
        localStorage.removeItem("emailUsuario")
        localStorage.removeItem("nomeUsuario")
        window.location.href = destino
        throw new Error(mensagem)
    }

    // Decodifica o payload de um JWT (a parte do meio, entre os dois pontos)
    function decodificarPayloadJWT(token) {
        try {
            const base64Url = token.split('.')[1]
            if (!base64Url) return null
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
            const json = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            )
            return JSON.parse(json)
        } catch (erro) {
            return null
        }
    }

    // Retorna true se o token não puder ser lido OU se já estiver expirado
    function tokenEstaExpirado(token) {
        const payload = decodificarPayloadJWT(token)
        if (!payload || !payload.exp) return true
        const agoraEmSegundos = Math.floor(Date.now() / 1000)
        return payload.exp < agoraEmSegundos
    }

    if (!token) {
        bloquearAcesso("Acesso Negado! Faça login para continuar.", "../index.html")
    }

    if (tokenEstaExpirado(token)) {
        bloquearAcesso("Sua sessão expirou. Faça login novamente.", "../index.html")
    }

    if (typeof nivelNecessario !== "undefined" && nivelNecessario !== "any") {
        if (!nivelUsuario) {
            bloquearAcesso("Sessão inválida. Faça login novamente.", "../index.html")
        }
        if (nivelUsuario !== nivelNecessario) {
            const destino = (nivelUsuario === "admin") ? "dashboard.html" : "home.html"
            bloquearAcesso(`Acesso negado. Área restrita a ${nivelNecessario}s.`, destino)
        }
    }

    document.body.style.display = ""
})()