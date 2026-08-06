require('dotenv').config()
const express = require('express')
const cors = require('cors')
const server = express()
server.use(cors())
server.use(express.json())
const pool = require('./db.js')
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json')
const api_chave = process.env.API_CHAVE;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const PORT = process.env.PORT

server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

server.listen(PORT, () => {
  console.log(`Server rodando no http://localhost:${PORT}/`)
  console.log(`Acesse o Swagger em: http://localhost:${PORT}/api-docs`);
})


// Middleware para verificar token JWT
const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ mensagem: "Token não fornecido" });

  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, api_chave);
    req.usuario = payload; // { email, nivel }
    next();
  } catch (erro) {
    return res.status(401).json({ mensagem: "Token inválido ou expirado" });
  }
};

// Middleware que restringe acesso somente a administradores
const verificarAdmin = (req, res, next) => {
  verificarToken(req, res, () => {
    if (req.usuario.nivel !== "admin") {
      return res.status(403).json({ mensagem: "Acesso restrito a administradores" });
    }
    next();
  });
};



// ─── LOGINS ────────────────────────────────────────────────────────────────

server.post("/cadastro", async (req, res) => {
  const { email, senha, nome, cpf } = req.body;
  try {

    const SoNome = /^[A-Za-zÀ-ÿ\s]+$/;
    if (!SoNome.test(nome.trim())) {
      return res.status(400).json({ mensagem: "O nome deve conter apenas letras." });
    }

    const [conferir] = await pool.execute(`SELECT email FROM usuarios WHERE email = ?`, [email]);
    if (conferir.length > 0) {
      return res.status(400).json({ mensagem: "Este e-mail já está cadastrado!" });
    }

    if (cpf.length !== 11) {
      return res.status(400).json({ mensagem: "CPF inválido" })
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    await pool.execute(
      `INSERT INTO usuarios (email, senha, nome, cpf, nivel) VALUES (?, ?, ?, ?, 'aluno')`,
      [email, senhaCriptografada, nome, cpf]
    );
    res.status(201).json({ mensagem: "Usuário cadastrado com sucesso!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ mensagem: "Erro ao cadastrar usuário!" });
  }
});

server.post("/login", async (req, res) => {
  const { email, senha } = req.body;
  try {
    const [conferir] = await pool.execute(
      `SELECT email, senha, nivel, nome FROM usuarios WHERE email = ?`, [email]
    );

    if (conferir.length === 0) {
      return res.status(401).json({ mensagem: "Usuário ou senha inválido!" });
    }

    const usuario = conferir[0];
    const validou = await bcrypt.compare(senha, usuario.senha);

    if (!validou) {
      return res.status(401).json({ mensagem: "Usuário ou senha inválido!" });
    }

    const token = jwt.sign(
      { email: usuario.email, nivel: usuario.nivel },
      api_chave,
      { expiresIn: "1h" }
    );

    res.json({
      mensagem: "Acesso Liberado",
      token: token,
      nivel: usuario.nivel,   //  importante para o front decidir o fluxo
      nome: usuario.nome
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ mensagem: "Erro ao fazer login!" });
  }
});

server.put("/trocar_senha", async (req, res) => {
  try {
    const { email, senha } = req.body;

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    await pool.query('UPDATE usuarios SET senha = ? WHERE email = ?', [senhaCriptografada, email]);

    res.json({ mensagem: "Senha alterada com sucesso!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensagem: "Erro ao alterar senha" });
  }
});





// ─── CURSOS ───────────────────────────────────────────────────────────────────

// GET /cursos → lista todos os cursos
server.get("/cursos", async (req, res) => {
  try {
    const [resultado] = await pool.query(`SELECT * FROM cursos`);
    res.json(resultado);
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensagem: "Erro ao buscar cursos" });
  }
});

// GET /cursos/:id → busca um curso específico pelo id
server.get("/cursos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [resultado] = await pool.query(`SELECT * FROM cursos WHERE id = ?`, [id]);

    if (resultado.length === 0) {
      return res.status(404).json({ mensagem: "Curso não encontrado" });
    }

    res.json(resultado[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensagem: "Erro ao buscar curso" });
  }
});


// Rota de criação de curso
server.post("/cursos", verificarAdmin, async (req, res) => {
  try {
    const { nome, duracao, vagas, descricao, status, area, resumo, carga_horaria, salario, mercado, perfil } = req.body;

    // Somente os campos essenciais são obrigatórios
    if (!nome || !duracao || !vagas || !status) {
      return res.status(400).json({ mensagem: "Campos obrigatórios: nome, duracao, vagas, status" });
    }

    const [resultado] = await pool.query(
      `INSERT INTO cursos (nome, duracao, vagas, descricao, status, area, resumo, carga_horaria, salario, mercado, perfil)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [nome, duracao, vagas, descricao || null, status, area || null, resumo || null, carga_horaria || null, salario || null, mercado || null, perfil || null]
    );

    res.status(201).json({
      mensagem: "Curso criado com sucesso!",
      id: resultado.insertId
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensagem: "Erro ao criar curso" });
  }
});

// Rota de atualização de curso 
server.put("/cursos/:id", verificarAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, duracao, vagas, descricao, status, area, resumo, carga_horaria, salario, mercado, perfil } = req.body;

    if (!nome || !duracao || !vagas || !status) {
      return res.status(400).json({ mensagem: "Campos obrigatórios: nome, duracao, vagas, status" });
    }

    const [resultado] = await pool.query(
      `UPDATE cursos 
       SET nome = ?, duracao = ?, vagas = ?, descricao = ?, status = ?, area = ?, resumo = ?, carga_horaria = ?, salario = ?, mercado = ?, perfil = ?
       WHERE id = ?`,
      [nome, duracao, vagas, descricao || null, status, area || null, resumo || null, carga_horaria || null, salario || null, mercado || null, perfil || null, id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensagem: "Curso não encontrado" });
    }

    res.json({ mensagem: "Curso atualizado com sucesso!" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ mensagem: "Erro ao atualizar curso" });
  }
});

// Rota de exclusão de curso
server.delete("/cursos/:id", verificarAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const [resultado] = await pool.query(`DELETE FROM cursos WHERE id = ?`, [id]);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensagem: "Curso não encontrado" });
    }

    res.json({ mensagem: "Curso excluído com sucesso!" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ mensagem: "Erro ao excluir curso" });
  }
});









// ─── Administrador ─────────────────────────────────────────────────────────

//RELATÓRIO 
server.get("/relatorios", verificarAdmin, async (req, res) => {
  try {
    const [totalUsuarios] = await pool.query(`SELECT COUNT(*) AS total FROM usuarios`);
    const [totalCursos] = await pool.query(`SELECT COUNT(*) AS total FROM cursos`);
    const [cursosAtivos] = await pool.query(`SELECT COUNT(*) AS total FROM cursos WHERE status = 'ativo'`);

    res.json({
      totalUsuarios: totalUsuarios[0].total,
      totalCursos: totalCursos[0].total,
      cursosAtivos: cursosAtivos[0].total
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensagem: "Erro ao carregar relatórios" });
  }
});
//atualizar nivel de usuario (apenas para admin)
server.put("/usuarios/:id", verificarAdmin, async (req, res) => {
  const { id } = req.params;
  const { nivel } = req.body;
  try {
    if (!nivel) {
      return res.status(400).json({ mensagem: "Nível é obrigatório." });
    }
    const [resultado] = await pool.execute(
      `UPDATE usuarios SET nivel = ? WHERE id = ?`,
      [nivel, id]
    );
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensagem: "Usuário não encontrado." });
    }
    res.json({ mensagem: "Usuário atualizado com sucesso!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensagem: "Erro ao atualizar usuário" });
  }
});
//deletar usuario (apenas para admin)
server.delete("/usuarios/:id", verificarAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const [resultado] = await pool.execute(`DELETE FROM usuarios WHERE id = ?`, [id]);
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensagem: "Usuário não encontrado." });
    }
    res.json({ mensagem: "Usuário excluído com sucesso!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensagem: "Erro ao excluir usuário." });
  }
});
// ver informações de usuários (apenas para admin)
server.get("/usuarios", verificarAdmin, async (req, res) => {
  try {
    const [resultado] = await pool.query(`SELECT id, nome, email, nivel, DATE_FORMAT(data, '%d/%m/%Y') AS data FROM usuarios ORDER BY nome`);
    res.json(resultado);
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensagem: "Erro ao buscar usuários" });
  }
});