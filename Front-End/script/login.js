const API_BASE = 'http://localhost:3000';

// ── Popup de escolha para admin ──────────────────────────────────────────────
function criarPopupAdmin(nome) {
  // Overlay
  const overlay = document.createElement('div');
  overlay.id = 'adminOverlay';
  overlay.style.cssText = `
    position:fixed;inset:0;background:rgba(0,0,0,.55);
    backdrop-filter:blur(4px);display:flex;align-items:center;
    justify-content:center;z-index:9999;
    animation:fadeIn .25s ease;
  `;

  overlay.innerHTML = `
    <div id="adminModal" style="
      background:#fff;border-radius:18px;padding:40px 36px;
      max-width:420px;width:90%;text-align:center;
      box-shadow:0 24px 60px rgba(0,0,0,.18);
      animation:slideUp .3s cubic-bezier(.34,1.56,.64,1);
    ">

      <h2 style="margin:0 0 6px;font-size:1.3rem;color:#1a1a2e;font-family:'Segoe UI',sans-serif;">
        Bem-vindo, ${nome.split(' ')[0]}!
      </h2>
      <p style="margin:0 0 28px;color:#666;font-size:.95rem;line-height:1.5;">
        Detectamos que você possui <strong>acesso administrativo</strong>.<br>
        Como deseja continuar?
      </p>

      <div style="display:flex;flex-direction:column;gap:12px;">
        <button id="btnAdmin" style="
          padding:14px;border:none;border-radius:12px;cursor:pointer;
          background:linear-gradient(135deg,#1a1a2e,#16213e);
          color:#fff;font-size:1rem;font-weight:600;
          font-family:'Segoe UI',sans-serif;
          transition:transform .15s,box-shadow .15s;
        ">
          Área Corporativa
        </button>
        <button id="btnAluno" style="
          padding:14px;border:2px solid #1a1a2e;border-radius:12px;cursor:pointer;
          background:#fff;color:#1a1a2e;font-size:1rem;font-weight:600;
          font-family:'Segoe UI',sans-serif;
          transition:transform .15s,box-shadow .15s;
        ">
          Área do Aluno
        </button>
      </div>
    </div>

    <style>
      @keyframes fadeIn  { from{opacity:0}  to{opacity:1} }
      @keyframes slideUp { from{transform:translateY(30px);opacity:0} to{transform:translateY(0);opacity:1} }
      #btnAdmin:hover  { transform:translateY(-2px);box-shadow:0 8px 20px rgba(26,26,46,.35); }
      #btnAluno:hover  { transform:translateY(-2px);box-shadow:0 8px 20px rgba(26,26,46,.15); }
    </style>
  `;

  document.body.appendChild(overlay);

  document.getElementById('btnAdmin').addEventListener('click', () => {
    fecharPopup();
    window.location.href = 'dashboard.html';
  });

  document.getElementById('btnAluno').addEventListener('click', () => {
    fecharPopup();
    window.location.href = 'home.html';
  });

  // Fechar clicando fora do modal
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) fecharPopup();
  });
}

function fecharPopup() {
  const overlay = document.getElementById('adminOverlay');
  if (overlay) overlay.remove();
}

// ── Submit do formulário ─────────────────────────────────────────────────────
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email       = document.getElementById("email").value;
  const senha       = document.getElementById("senha").value;
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

    if (resposta.ok && dados.token) {
      // Salva dados na sessão
      localStorage.setItem('tokenIntranet', dados.token);
      localStorage.setItem('emailUsuario', email);
      localStorage.setItem('nomeUsuario', dados.nome);
      localStorage.setItem('nivelUsuario', dados.nivel);

      mensagemDiv.className = "mensagem sucesso";
      mensagemDiv.textContent = "Login realizado com sucesso!";

      if (dados.nivel === 'admin') {
        // Admin → mostra popup de escolha
        criarPopupAdmin(dados.nome);
      } else {
        // Aluno → vai direto para home
        setTimeout(() => {
          window.location.href = "home.html";
        }, 1000);
      }

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