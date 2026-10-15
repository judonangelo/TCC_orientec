// area de configuracao
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const server = express()
server.use(cors())
server.use(express.json({ limit: '10mb' }))
const pool = require('./db.js')
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json')
const api_chave = process.env.API_CHAVE
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const PORT = process.env.PORT
server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

server.listen(PORT, () => {
  console.log(`Server rodando no http://localhost:${PORT}/`)
  console.log(`Acesse o Swagger em: http://localhost:${PORT}/api-docs`)//ou 10.111.9.35
})

// AREA DE AUTENTICACAO
const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader) return res.status(401).json({ mensagem: "Token não fornecido" })

  const token = authHeader.split(" ")[1]
  try {
    const payload = jwt.verify(token, api_chave)
    req.usuario = payload
    next()
  } catch (erro) {
    return res.status(401).json({ mensagem: "Token inválido ou expirado" })
  }
}

const verificarAdmin = (req, res, next) => {
  verificarToken(req, res, () => {
    if (req.usuario.nivel !== "admin") {
      return res.status(403).json({ mensagem: "Acesso restrito a administradores" })
    }
    next()
  })
}

// area de cadastro
server.post("/cadastro", async (req, res) => {
  const { email, senha, nome, cpf } = req.body
  try {

    const SoNome = /^[A-Za-zÀ-ÿ\s]+$/
    if (!SoNome.test(nome.trim())) {
      return res.status(400).json({ mensagem: "O nome deve conter apenas letras." })
    }

    if (!senha || senha.length < 6) {
      return res.status(400).json({ mensagem: "A senha deve ter no mínimo 6 caracteres." })
    }

    if (!cpf || cpf.length !== 11) {
      return res.status(400).json({ mensagem: "CPF inválido!" })
    }

    const [existentes] = await pool.execute(
      `SELECT email, cpf FROM usuarios WHERE email = ? OR cpf = ?`,
      [email, cpf]
    )

    if (existentes.length > 0) {
      const emailJaExiste = existentes.some(u => u.email === email)
      const cpfJaExiste = existentes.some(u => u.cpf === cpf)

      if (emailJaExiste) {
        return res.status(400).json({ mensagem: "E-mail já cadastrado!" })
      }

      if (cpfJaExiste) {
        return res.status(400).json({ mensagem: "CPF já cadastrado!" })
      }
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10)

    await pool.execute(
      `INSERT INTO usuarios (email, senha, nome, cpf, nivel) VALUES (?, ?, ?, ?, 'aluno')`,
      [email, senhaCriptografada, nome, cpf]
    )

    res.status(201).json({ mensagem: "Usuário cadastrado com sucesso!" })
  } catch (error) {
    console.log(error)

    if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
      if (error.sqlMessage && error.sqlMessage.includes('email')) {
        return res.status(400).json({ mensagem: "E-mail já cadastrado!" })
      }
      if (error.sqlMessage && error.sqlMessage.includes('cpf')) {
        return res.status(400).json({ mensagem: "CPF já cadastrado!" })
      }
    }

    return res.status(500).json({ mensagem: "Erro ao cadastrar usuário!" })
  }
})

// area de login
server.post("/login", async (req, res) => {
  const { email, senha } = req.body
  try {
    const [conferir] = await pool.execute(
      `SELECT email, senha, nivel, nome, foto FROM usuarios WHERE email = ?`, [email]
    )

    if (conferir.length === 0) {
      return res.status(401).json({ mensagem: "Usuário ou senha inválido!" })
    }

    const usuario = conferir[0]
    const validou = await bcrypt.compare(senha, usuario.senha)

    if (!validou) {
      return res.status(401).json({ mensagem: "Usuário ou senha inválido!" })
    }

    const token = jwt.sign(
      { email: usuario.email, nivel: usuario.nivel },
      api_chave,
      { expiresIn: "1h" }
    )

    res.json({
      mensagem: "Acesso Liberado",
      token: token,
      nivel: usuario.nivel,
      nome: usuario.nome,
      foto: usuario.foto || null
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ mensagem: "Erro ao fazer login!" })
  }
})

// area de senha
server.put("/alterar_senha", verificarToken, async (req, res) => {
  try {
    const { senhaAtual, novaSenha } = req.body
    const email = req.usuario.email

    if (!senhaAtual || !novaSenha || novaSenha.length < 6) {
      return res.status(400).json({ mensagem: "Informe a senha atual e uma nova senha com no mínimo 6 caracteres." })
    }

    const [usuarios] = await pool.execute(`SELECT senha FROM usuarios WHERE email = ?`, [email])
    if (usuarios.length === 0) {
      return res.status(404).json({ mensagem: "Usuário não encontrado." })
    }

    const usuario = usuarios[0]
    const senhaCorreta = await bcrypt.compare(senhaAtual, usuario.senha)

    if (!senhaCorreta) {
      return res.status(401).json({ mensagem: "Senha atual incorreta!" })
    }

    const senhaCriptografada = await bcrypt.hash(novaSenha, 10)
    await pool.execute('UPDATE usuarios SET senha = ? WHERE email = ?', [senhaCriptografada, email])

    res.json({ mensagem: "Senha alterada com sucesso!" })
  } catch (error) {
    console.log(error)
    res.status(500).json({ mensagem: "Erro ao alterar senha." })
  }
})

server.put("/redefinir_senha_sem_email", async (req, res) => {
  try {
    const { email, cpf, novaSenha } = req.body

    if (!email || !cpf || !novaSenha || novaSenha.length < 6) {
      return res.status(400).json({ mensagem: "Preencha E-mail, CPF e uma nova senha válida." })
    }

    const [usuarios] = await pool.execute(
      `SELECT id FROM usuarios WHERE email = ? AND cpf = ?`,
      [email, cpf]
    )

    if (usuarios.length === 0) {
      return res.status(400).json({ mensagem: "Dados incorretos. Verifique o E-mail e o CPF digitados." })
    }

    const senhaCriptografada = await bcrypt.hash(novaSenha, 10)
    await pool.execute('UPDATE usuarios SET senha = ? WHERE email = ? AND cpf = ?', [senhaCriptografada, email, cpf])

    res.json({ mensagem: "Senha redefinida com sucesso!" })
  } catch (error) {
    console.log(error)
    res.status(500).json({ mensagem: "Erro ao redefinir senha." })
  }
})

// AREA DE CURSOS

//lista todos os cursos
server.get("/cursos", async (req, res) => {
  try {
    const [cursos] = await pool.query(`SELECT * FROM cursos ORDER BY id`)
    const [vinculos] = await pool.query(
      `SELECT ct.curso_id, ct.peso, t.id AS tag_id, t.chave, t.nome, t.descricao
       FROM cursos_tags ct
       JOIN tags t ON t.id = ct.tag_id
       ORDER BY t.nome`
    )

    const resultado = cursos.map(curso => ({
      ...curso,
      tags: vinculos
        .filter(v => v.curso_id === curso.id)
        .map(v => ({
          tag_id: v.tag_id,
          chave: v.chave,
          nome: v.nome,
          descricao: v.descricao,
          peso: v.peso
        }))
    }))

    res.json(resultado)
  } catch (error) {
    console.log(error)
    res.status(500).json({ mensagem: "Erro ao buscar cursos" })
  }
})

// busca um curso específico
server.get("/cursos/:id", async (req, res) => {
  try {
    const { id } = req.params

    const [cursos] = await pool.query(`SELECT * FROM cursos WHERE id = ?`, [id])
    if (cursos.length === 0) {
      return res.status(404).json({ mensagem: "Curso não encontrado" })
    }

    const [vinculos] = await pool.query(
      `SELECT ct.peso, t.id AS tag_id, t.chave, t.nome, t.descricao
       FROM cursos_tags ct
       JOIN tags t ON t.id = ct.tag_id
       WHERE ct.curso_id = ?
       ORDER BY t.nome`,
      [id]
    )

    const curso = cursos[0]
    curso.tags = vinculos.map(v => ({
      tag_id: v.tag_id,
      chave: v.chave,
      nome: v.nome,
      descricao: v.descricao,
      peso: v.peso
    }))

    res.json(curso)
  } catch (error) {
    console.log(error)
    res.status(500).json({ mensagem: "Erro ao buscar curso" })
  }
})

// criar curso (admin)
server.post("/cursos", verificarAdmin, async (req, res) => {
  const connection = await pool.getConnection()
  try {
    const {
      nome, duracao, vagas, descricao, status, area, resumo,
      carga_horaria, salario, mercado, perfil, tags
    } = req.body

    if (!nome || !duracao || !vagas || !status) {
      return res.status(400).json({
        mensagem: "Campos obrigatórios: nome, duracao, vagas, status"
      })
    }

    if (!Array.isArray(tags) || tags.length === 0) {
      return res.status(400).json({
        mensagem: "Selecione pelo menos uma tag para o curso."
      })
    }

    await connection.beginTransaction()

    const [resultado] = await connection.query(
      `INSERT INTO cursos
         (nome, duracao, vagas, descricao, status, area, resumo,
          carga_horaria, salario, mercado, perfil)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nome, duracao, vagas, descricao || null, status,
        area || null, resumo || null,
        carga_horaria || null, salario || null,
        mercado || null, perfil || null
      ]
    )

    const cursoId = resultado.insertId

    for (const t of tags) {
      if (!t.tag_id) continue
      const peso = Math.max(0, Math.min(3, parseInt(t.peso) || 0))
      await connection.query(
        `INSERT INTO cursos_tags (curso_id, tag_id, peso) VALUES (?, ?, ?)`,
        [cursoId, t.tag_id, peso]
      )
    }

    await connection.commit()

    res.status(201).json({
      mensagem: "Curso criado com sucesso!",
      id: cursoId
    })
  } catch (error) {
    await connection.rollback()
    console.log(error)
    res.status(500).json({ mensagem: "Erro ao criar curso" })
  } finally {
    connection.release()
  }
})

// atualizar curso (admin)
server.put("/cursos/:id", verificarAdmin, async (req, res) => {
  const { id } = req.params
  const connection = await pool.getConnection()
  try {
    const {
      nome, duracao, vagas, descricao, status, area, resumo,
      carga_horaria, salario, mercado, perfil, tags
    } = req.body

    if (!nome || !duracao || !vagas || !status) {
      return res.status(400).json({
        mensagem: "Campos obrigatórios: nome, duracao, vagas, status"
      })
    }

    if (!Array.isArray(tags) || tags.length === 0) {
      return res.status(400).json({
        mensagem: "Selecione pelo menos uma tag para o curso."
      })
    }

    await connection.beginTransaction()

    const [resultado] = await connection.query(
      `UPDATE cursos
       SET nome = ?, duracao = ?, vagas = ?, descricao = ?, status = ?,
           area = ?, resumo = ?, carga_horaria = ?, salario = ?,
           mercado = ?, perfil = ?
       WHERE id = ?`,
      [
        nome, duracao, vagas, descricao || null, status,
        area || null, resumo || null,
        carga_horaria || null, salario || null,
        mercado || null, perfil || null, id
      ]
    )

    if (resultado.affectedRows === 0) {
      await connection.rollback()
      return res.status(404).json({ mensagem: "Curso não encontrado" })
    }

    // Substitui as tags do curso: apaga tudo e recria
    await connection.query(`DELETE FROM cursos_tags WHERE curso_id = ?`, [id])

    for (const t of tags) {
      if (!t.tag_id) continue
      const peso = Math.max(0, Math.min(3, parseInt(t.peso) || 0))
      await connection.query(
        `INSERT INTO cursos_tags (curso_id, tag_id, peso) VALUES (?, ?, ?)`,
        [id, t.tag_id, peso]
      )
    }

    await connection.commit()
    res.json({ mensagem: "Curso atualizado com sucesso!" })
  } catch (error) {
    await connection.rollback()
    console.log(error)
    res.status(500).json({ mensagem: "Erro ao atualizar curso" })
  } finally {
    connection.release()
  }
})

server.delete("/cursos/:id", verificarAdmin, async (req, res) => {
  try {
    const { id } = req.params
    const [resultado] = await pool.query(`DELETE FROM cursos WHERE id = ?`, [id])

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensagem: "Curso não encontrado" })
    }

    res.json({ mensagem: "Curso excluído com sucesso!" })
  } catch (error) {
    console.log(error)
    res.status(500).json({ mensagem: "Erro ao excluir curso" })
  }
})

// AREA DE TAGS
// lista o vocabulário global (público, usado pelo quiz e dashboard)
server.get("/tags", async (req, res) => {
  try {
    const [resultado] = await pool.query(
      `SELECT id, chave, nome, descricao, ativo FROM tags WHERE ativo = 1 ORDER BY nome`
    )
    res.json(resultado)
  } catch (error) {
    console.log(error)
    res.status(500).json({ mensagem: "Erro ao buscar tags" })
  }
})

// lista TODAS (inclusive inativas) — só admin
server.get("/tags/todas", verificarAdmin, async (req, res) => {
  try {
    const [resultado] = await pool.query(
      `SELECT id, chave, nome, descricao, ativo FROM tags ORDER BY nome`
    )
    res.json(resultado)
  } catch (error) {
    console.log(error)
    res.status(500).json({ mensagem: "Erro ao buscar tags" })
  }
})

//criar nova tag (admin)
server.post("/tags", verificarAdmin, async (req, res) => {
  try {
    const { chave, nome, descricao, ativo } = req.body

    if (!chave || !nome) {
      return res.status(400).json({ mensagem: "Chave e nome são obrigatórios." })
    }

    if (!/^[a-z0-9_]+$/.test(chave)) {
      return res.status(400).json({
        mensagem: "A chave deve conter apenas letras minúsculas, números e underscore."
      })
    }

    const [resultado] = await pool.query(
      `INSERT INTO tags (chave, nome, descricao, ativo) VALUES (?, ?, ?, ?)`,
      [chave, nome, descricao || null, ativo === 0 ? 0 : 1]
    )

    res.status(201).json({
      mensagem: "Tag criada com sucesso!",
      id: resultado.insertId
    })
  } catch (error) {
    console.log(error)
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ mensagem: "Já existe uma tag com essa chave." })
    }
    res.status(500).json({ mensagem: "Erro ao criar tag" })
  }
})

// atualizar tag (admin)
server.put("/tags/:id", verificarAdmin, async (req, res) => {
  try {
    const { id } = req.params
    const { chave, nome, descricao, ativo } = req.body

    if (!chave || !nome) {
      return res.status(400).json({ mensagem: "Chave e nome são obrigatórios." })
    }

    if (!/^[a-z0-9_]+$/.test(chave)) {
      return res.status(400).json({
        mensagem: "A chave deve conter apenas letras minúsculas, números e underscore."
      })
    }

    const [resultado] = await pool.query(
      `UPDATE tags SET chave = ?, nome = ?, descricao = ?, ativo = ? WHERE id = ?`,
      [chave, nome, descricao || null, ativo === 0 ? 0 : 1, id]
    )

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensagem: "Tag não encontrada." })
    }

    res.json({ mensagem: "Tag atualizada com sucesso!" })
  } catch (error) {
    console.log(error)
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ mensagem: "Já existe uma tag com essa chave." })
    }
    res.status(500).json({ mensagem: "Erro ao atualizar tag" })
  }
})

// excluir tag (admin)
server.delete("/tags/:id", verificarAdmin, async (req, res) => {
  try {
    const { id } = req.params
    const [resultado] = await pool.query(`DELETE FROM tags WHERE id = ?`, [id])

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensagem: "Tag não encontrada." })
    }

    res.json({ mensagem: "Tag excluída com sucesso!" })
  } catch (error) {
    console.log(error)
    res.status(500).json({ mensagem: "Erro ao excluir tag" })
  }
})

// AREA DE PERGUNTAS
server.get('/perguntas', async (req, res) => {
  try {
    const [perguntas] = await pool.query('SELECT * FROM perguntas ORDER BY id ASC')
    const [respostas] = await pool.query('SELECT * FROM respostas')

    const resultado = perguntas.map(p => {
      return {
        id: p.id,
        pergunta: p.texto,
        respostas: respostas
          .filter(r => r.pergunta_id === p.id)
          .map(r => ({
            id: r.id,
            texto: r.texto,
            pesos: typeof r.pesos === 'string' ? JSON.parse(r.pesos) : r.pesos
          }))
      }
    })

    res.json(resultado)
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao buscar perguntas' })
  }
})

server.post('/perguntas', verificarAdmin, async (req, res) => {
  const connection = await pool.getConnection()
  try {
    const { pergunta, respostas } = req.body

    if (!pergunta || !respostas || !Array.isArray(respostas) || respostas.length === 0) {
      return res.status(400).json({ mensagem: 'Pergunta e respostas sao obrigatorias' })
    }

    await connection.beginTransaction()

    const [perguntaResult] = await connection.query(
      'INSERT INTO perguntas (texto) VALUES (?)',
      [pergunta]
    )
    const perguntaId = perguntaResult.insertId

    for (const resp of respostas) {
      await connection.query(
        'INSERT INTO respostas (pergunta_id, texto, pesos) VALUES (?, ?, ?)',
        [perguntaId, resp.texto, JSON.stringify(resp.pesos)]
      )
    }

    await connection.commit()
    res.status(201).json({ mensagem: 'Pergunta cadastrada com sucesso', id: perguntaId })
  } catch (error) {
    await connection.rollback()
    res.status(500).json({ mensagem: 'Erro ao cadastrar pergunta' })
  } finally {
    connection.release()
  }
})

server.put('/perguntas/:id', verificarAdmin, async (req, res) => {
  const { id } = req.params
  const { pergunta, respostas } = req.body

  const connection = await pool.getConnection()
  try {
    await connection.beginTransaction()

    await connection.query('UPDATE perguntas SET texto = ? WHERE id = ?', [pergunta, id])
    await connection.query('DELETE FROM respostas WHERE pergunta_id = ?', [id])

    for (const resp of respostas) {
      await connection.query(
        'INSERT INTO respostas (pergunta_id, texto, pesos) VALUES (?, ?, ?)',
        [id, resp.texto, JSON.stringify(resp.pesos)]
      )
    }

    await connection.commit()
    res.json({ mensagem: 'Pergunta atualizada com sucesso' })
  } catch (error) {
    await connection.rollback()
    res.status(500).json({ mensagem: 'Erro ao atualizar pergunta' })
  } finally {
    connection.release()
  }
})

server.delete('/perguntas/:id', verificarAdmin, async (req, res) => {
  const { id } = req.params
  try {
    const [resultado] = await pool.query('DELETE FROM perguntas WHERE id = ?', [id])
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensagem: 'Pergunta nao encontrada' })
    }
    res.json({ mensagem: 'Pergunta excluida com sucesso' })
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao excluir pergunta' })
  }
})

// AREA DO PERFIL
// Buscar dados completos do perfil do usuário logado
server.get("/perfil", verificarToken, async (req, res) => {
  try {
    const email = req.usuario.email
    const [usuarios] = await pool.execute(
      `SELECT nome, email, foto FROM usuarios WHERE email = ?`,
      [email]
    )

    if (usuarios.length === 0) {
      return res.status(404).json({ mensagem: "Usuário não encontrado." })
    }

    res.json(usuarios[0])
  } catch (error) {
    console.log(error)
    res.status(500).json({ mensagem: "Erro ao carregar perfil." })
  }
})

// Atualizar a foto do usuário logado
server.put("/perfil/foto", verificarToken, async (req, res) => {
  try {
    const email = req.usuario.email
    const { foto } = req.body

    await pool.execute(
      `UPDATE usuarios SET foto = ? WHERE email = ?`,
      [foto || null, email]
    )

    res.json({ mensagem: "Foto atualizada com sucesso!" })
  } catch (error) {
    console.log(error)
    res.status(500).json({ mensagem: "Erro ao salvar foto no banco de dados." })
  }
})

// AREA DO ADMINISTRADOR

//relatorio
server.get("/relatorios", verificarAdmin, async (req, res) => {
  try {
    const [totalUsuarios] = await pool.query(`SELECT COUNT(*) AS total FROM usuarios`)
    const [totalCursos] = await pool.query(`SELECT COUNT(*) AS total FROM cursos`)
    const [cursosAtivos] = await pool.query(`SELECT COUNT(*) AS total FROM cursos WHERE status = 'ativo'`)

    res.json({
      totalUsuarios: totalUsuarios[0].total,
      totalCursos: totalCursos[0].total,
      cursosAtivos: cursosAtivos[0].total
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ mensagem: "Erro ao carregar relatórios" })
  }
})
//atualizar nivel de usuario (apenas para admin)
server.put("/usuarios/:id", verificarAdmin, async (req, res) => {
  const { id } = req.params
  const { nivel } = req.body
  try {
    if (!nivel) {
      return res.status(400).json({ mensagem: "Nível é obrigatório." })
    }
    const [resultado] = await pool.execute(
      `UPDATE usuarios SET nivel = ? WHERE id = ?`,
      [nivel, id]
    )
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensagem: "Usuário não encontrado." })
    }
    res.json({ mensagem: "Usuário atualizado com sucesso!" })
  } catch (error) {
    console.log(error)
    res.status(500).json({ mensagem: "Erro ao atualizar usuário" })
  }
})
//deletar usuario (apenas para admin)
server.delete("/usuarios/:id", verificarAdmin, async (req, res) => {
  const { id } = req.params
  try {
    const [resultado] = await pool.execute(`DELETE FROM usuarios WHERE id = ?`, [id])
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensagem: "Usuário não encontrado." })
    }
    res.json({ mensagem: "Usuário excluído com sucesso!" })
  } catch (error) {
    console.log(error)
    res.status(500).json({ mensagem: "Erro ao excluir usuário." })
  }
})
// ver informações de usuários (apenas para admin)
server.get("/usuarios", verificarAdmin, async (req, res) => {
  try {
    const [resultado] = await pool.query(`SELECT id, nome, email, nivel, DATE_FORMAT(data, '%d/%m/%Y') AS data FROM usuarios ORDER BY nome`)
    res.json(resultado)
  } catch (error) {
    console.log(error)
    res.status(500).json({ mensagem: "Erro ao buscar usuários" })
  }
})