document.getElementById("btn_cadastrar").addEventListener("click",async()=>{
    const email = document.getElementById("inp_email").value
    const senha = document.getElementById("inp_senha").value

    const resposta = await fetch(`http://localhost:3000/cadastrar_user`,{
        method:"post",
        headers: {
            "Accept":"application/json",
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            "email":email,
            "senha":senha
        })
    })
    if(resposta.ok == true){
        const dados = await resposta.json()
        alert("Usuário cadastrado")
    }
})

document.getElementById("btn_ver").addEventListener("click",async()=>{
    const resposta = await fetch(`http://localhost:3000/ver_usuarios`,{
        method:"get",
        headers: {
            "Accept":"application/json",
            "Content-Type":"application/json"
        }
    })
    if(resposta.ok == true){
        const dados = await resposta.json()
        document.getElementById("ver").innerText = JSON.stringify(dados, null, 2)   
    }
})

document.getElementById("btn_atualizar").addEventListener("click",async()=>{
    const id = document.getElementById("upd_id").value
    const email = document.getElementById("upd_email").value
    const senha = document.getElementById("upd_senha").value

    const resposta = await fetch(`http://localhost:3000/atualizar_usuarios`,{
        method:"put",
        headers: {
            "Accept":"application/json",
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            "id":id,
            "email":email,
            "senha":senha
        })
    })
    if(resposta.ok == true){
        const dados = await resposta.json()
        alert("Usuário atualizado")
    }
})

document.getElementById("btn_deletar").addEventListener("click",async()=>{
    const id = document.getElementById("inp_deletar").value

    const resposta = await fetch(`http://localhost:3000/deletar_usuarios`,{
        method:"delete",
        headers: {
            "Accept":"application/json",
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            "id":id
        })
    })
    if(resposta.ok == true){
        const dados = await resposta.json()
        alert("Usuário deletado")
    }
})