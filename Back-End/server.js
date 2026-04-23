require('dotenv').config()
const express = require ('express')
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

server.use('/api-docs',swaggerUi.serve, swaggerUi.setup(swaggerDocument))

server.listen(PORT,()=>{
    console.log(`Server rodando no http://localhost:${PORT}/`)
})

//rota de cadastro, confere se ja tem email, criptografa a senha e cadastra
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




//rota de login, confere se tem esse email, transforma a senha em criptografada, se passar = cria token de 1h
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















































//talvez use




server.get("/ver_usuarios",async(req,res)=>{
    try {
        const [resultado] = await pool.query(`Select * from usuarios`)
        res.send(resultado)
    } catch (error) {
        console.log(error)
    }
})

server.put("/atualizar_usuarios",async(req,res)=>{
    try {
        const {id,email,senha} = req.body
        const [resultado] = await pool.query(`Update usuarios set email = "${email}", senha = "${senha}" where id = ${id}`)
        res.send(resultado)
    } catch (error) {
        console.log(error)
    }
})

server.delete("/deletar_usuarios",async(req,res)=>{
    try {
        const {id} = req.body
        const [resultado] = await pool.query(`Delete from usuarios where id = ${id}`)
        res.send(resultado)
    } catch (error) {
        console.log(error)
    }
})