const express = require ('express')
const cors = require('cors')
const server = express()
server.use(cors())
server.use(express.json())
const pool = require('./db.js')
const swaggerUi = require('swagger-ui-express') 
const swaggerDocument = require('./swagger.json')



require('dotenv').config()  

const PORT = process.env.PORT

server.use('/api-docs',swaggerUi.serve, swaggerUi.setup(swaggerDocument))

server.listen(PORT,()=>{
    console.log(`Server rodando no http://localhost:${PORT}/`)
})


server.post("/cadastrar",async(req,res)=>{
    try {
        const {email,senha} = req.body
        const [resultado] = await pool.query(`Insert into usuarios (email,senha,nivel) values ("${email}","${senha}","user")`)
        res.send(resultado)
    } catch (error) {
       console.log(error) 
    }
})

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