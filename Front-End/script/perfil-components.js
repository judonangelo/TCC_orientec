const API_URL = 'http://localhost:3000'

function injetarPainelPerfil() {
  if (document.getElementById('profilePanel')) return

  const htmlPainel = `
    <div class="panel-overlay" id="overlay"></div>

    <aside class="profile-panel" id="profilePanel">
        <div class="panel-header">
            <button class="panel-close" onclick="closePanel()">✕</button>

            <input type="file" id="avatarInput" accept="image/png, image/jpeg, image/jpg, image/webp" style="display: none;" onchange="alterarFotoPerfil(event)">

            <!-- Avatar com Wrapper para o Mini Menu -->
            <div class="panel-avatar-wrapper">
                <div class="panel-avatar" id="panelInitials" onclick="toggleAvatarMenu(event)" title="Opções da foto">
                    ??
                </div>

                <!-- Mini Menu de Opções -->
                <div class="avatar-menu" id="avatarMenu" style="display: none;">
                    <button type="button" onclick="selecionarNovaFoto()">Alterar foto</button>
                    <button type="button" class="btn-remove-photo" id="btnRemovePhoto" onclick="removerFotoPerfil()">Remover foto</button>
                </div>
            </div>

            <div class="panel-user-name" id="panelName">Carregando...</div>
            <div class="panel-user-email" id="panelEmail">...</div>
        </div>
        <div class="panel-body">
            <div id="sectionInfo">
                <p class="panel-section-title">Informações da Conta</p>
                <div id="viewMode">
                    <div class="info-field">
                        <label>Nome completo</label>
                        <span id="viewName">...</span>
                    </div>
                    <div class="info-field">
                        <label>E-mail</label>
                        <span id="viewEmail">...</span>
                    </div>
                </div>
            </div>
            <hr style="margin: 24px 0; border-color: #e2e8f0;">
            <button class="btn-save" onclick="window.location.href='alterar_senha.html'" style="margin-top:12px;">Trocar senha</button>
            <button class="btn-danger-outline" onclick="logout()">Sair da conta</button>
        </div>
    </aside>
  `

  document.body.insertAdjacentHTML('beforeend', htmlPainel)
  document.getElementById('overlay')?.addEventListener('click', closePanel)
  
  document.addEventListener('click', (e) => {
    const wrapper = document.querySelector('.panel-avatar-wrapper')
    if (wrapper && !wrapper.contains(e.target)) {
      fecharAvatarMenu()
    }
  })

  carregarDadosPerfil()
}

function toggleAvatarMenu(event) {
  event.stopPropagation()
  const menu = document.getElementById('avatarMenu')
  if (menu) {
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block'
  }
}

function fecharAvatarMenu() {
  const menu = document.getElementById('avatarMenu')
  if (menu) menu.style.display = 'none'
}

function selecionarNovaFoto() {
  fecharAvatarMenu()
  document.getElementById('avatarInput').click()
}

async function removerFotoPerfil() {
  fecharAvatarMenu()
  if (!confirm("Tem certeza que deseja remover sua foto de perfil?")) return

  const token = localStorage.getItem('tokenIntranet')
  try {
    const resposta = await fetch(`${API_URL}/perfil/foto`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ foto: null })
    })

    if (resposta.ok) {
      carregarDadosPerfil()
    } else {
      alert('Erro ao remover a foto de perfil.')
    }
  } catch (error) {
    console.error('Erro ao remover foto:', error)
  }
}

async function carregarDadosPerfil() {
  const token = localStorage.getItem('tokenIntranet')
  if (!token) return

  try {
    const resposta = await fetch(`${API_URL}/perfil`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!resposta.ok) return

    const usuario = await resposta.json()

    const elInitials = document.getElementById('panelInitials')
    const elName = document.getElementById('panelName')
    const elEmail = document.getElementById('panelEmail')
    const elViewName = document.getElementById('viewName')
    const elViewEmail = document.getElementById('viewEmail')
    const btnRemove = document.getElementById('btnRemovePhoto')

    if (elInitials) {
      if (usuario.foto) {
        elInitials.innerHTML = `<img src="${usuario.foto}" alt="Foto de Perfil" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`
        if (btnRemove) btnRemove.style.display = 'block'
      } else {
        const partes = (usuario.nome || 'Estudante').trim().split(' ')
        const iniciais = partes.length > 1 
          ? (partes[0][0] + partes[partes.length - 1][0]).toUpperCase()
          : (usuario.nome[0] || '?').toUpperCase()
        elInitials.textContent = iniciais
        if (btnRemove) btnRemove.style.display = 'none' 
      }
    }

    if (elName) elName.textContent = usuario.nome
    if (elEmail) elEmail.textContent = usuario.email
    if (elViewName) elViewName.textContent = usuario.nome
    if (elViewEmail) elViewEmail.textContent = usuario.email

  } catch (error) {
    console.error("Erro ao carregar perfil:", error)
  }
}

function comprimirImagem(file, maxWidth = 300, maxHeight = 300, quality = 0.7) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = URL.createObjectURL(file)
    
    img.onload = () => {
      const canvas = document.createElement('canvas')
      let width = img.width
      let height = img.height

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width)
          width = maxWidth
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height)
          height = maxHeight
        }
      }

      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, width, height)

      const dataUrl = canvas.toDataURL('image/jpeg', quality)
      resolve(dataUrl)
    }

    img.onerror = (error) => reject(error)
  })
}

async function alterarFotoPerfil(event) {
  fecharAvatarMenu()
  const arquivo = event.target.files[0]
  if (!arquivo) return

  try {
    const imagemBase64 = await comprimirImagem(arquivo, 300, 300, 0.7)
    const token = localStorage.getItem('tokenIntranet')

    const resposta = await fetch(`${API_URL}/perfil/foto`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ foto: imagemBase64 })
    })

    if (resposta.ok) {
      carregarDadosPerfil()
    } else {
      alert('Erro ao salvar a foto de perfil.')
    }
  } catch (error) {
    console.error('Erro ao processar imagem:', error)
  }
}

function openPanel() {
  document.getElementById('overlay')?.classList.add('open')
  document.getElementById('profilePanel')?.classList.add('open')
  document.body.style.overflow = 'hidden'
}

function closePanel() {
  fecharAvatarMenu()
  document.getElementById('overlay')?.classList.remove('open')
  document.getElementById('profilePanel')?.classList.remove('open')
  document.body.style.overflow = ''
}

function logout() {
  if (confirm("Tem certeza que deseja sair?")) {
    localStorage.clear()
    window.location.href = "login.html"
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injetarPainelPerfil)
} else {
  injetarPainelPerfil()
}