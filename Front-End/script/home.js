const nomeUsuario = localStorage.getItem("nomeUsuario") || "Estudante"

const heroNome = document.getElementById("heroNome")
if (heroNome) {
    heroNome.textContent = nomeUsuario
}