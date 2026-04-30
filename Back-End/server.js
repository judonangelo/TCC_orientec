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
})

// ─── USUÁRIOS ────────────────────────────────────────────────────────────────

// Rota de cadastro: confere se já tem email, criptografa a senha e cadastra
server.post("/cadastro", async (req, res) => {
  const { email, senha } = req.body;

  try {
    const [conferir] = await pool.execute(`SELECT email FROM usuarios WHERE email = ?`, [email]);
    if (conferir.length > 0) {
      return res.status(400).json({ "mensagem": "Este e-mail já está cadastrado!" });
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    await pool.execute(
      `INSERT INTO usuarios (email, senha) VALUES (?, ?)`,
      [email, senhaCriptografada]
    );
    res.status(201).json({ "mensagem": "Usuário cadastrado com sucesso!" });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ "mensagem": "Erro ao cadastrar usuário!" });
  }
});

// Rota de login: confere se tem esse email, valida senha, gera token de 1h
server.post("/login", async (req, res) => {
  const { email, senha } = req.body
  try {
    const [conferir] = await pool.execute(`SELECT email FROM usuarios WHERE email = ?`, [email])
    if (conferir.length > 0) {
      const [resultado] = await pool.execute(`SELECT * FROM usuarios WHERE email = ? `, [email])

      const validou = await bcrypt.compare(senha, resultado[0].senha)

      if (validou == false) {
        return res.status(401).json({ "mensagem": "Usuário ou senha inválido!" })
      }

      const token = jwt.sign({
        email: email,
      }, api_chave, {
        expiresIn: "1h"
      })

      res.json({ "mensagem": "Acesso Liberado", "token": token })
    } else {
      return res.json({ "mensagem": "Nenhum e-mail encontrado!" })
    }
  } catch (error) {
    console.log(error)
    return res.json({ "mensagem": "Erro ao fazer login !" })
  }
})

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


// Rota de criação de curso (POST) 
server.post("/cursos", async (req, res) => {
  try {
    const { nome, duracao, vagas, descricao, status, area, resumo, carga_horaria, salario, mercado, perfil } = req.body;

    // Validação simples
    if (!nome || !duracao || !vagas || !status || !area || !resumo || !carga_horaria || !salario || !mercado || !perfil || !descricao || !resumo) {
      return res.status(400).json({ mensagem: "Campos obrigatórios: nome, duracao, vagas, status, área, resumo, carga horária, salário, mercado, perfil, descrição e resumo " });
    }

    const [resultado] = await pool.query(
      `INSERT INTO cursos (nome, duracao, vagas, descricao, status, area, resumo, carga_horaria, salario, mercado, perfil)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [nome, duracao, vagas, descricao, status, area, resumo, carga_horaria, salario, mercado, perfil]
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

// Rota de atualização de curso (PUT)
server.put("/cursos/:id", async (req, res) => {
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
server.delete("/cursos/:id", async (req, res) => {
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

// ─── USUÁRIOS (admin) ─────────────────────────────────────────────────────────

