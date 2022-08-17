const lista = require("../models/lista")
const usuario = require("../models/usuarios")

module.exports = (app)=>{
    app.post('/lista',async (req,res)=>{
        var dados = req.body

        const database = require("../config/database")()
        const lista = require("../models/lista")

        var gravar = await new lista({
            data:dados.data,
            titulo:dados.titulo,
            tipo:dados.tipo,
            observacao:dados.observacao,
            usuario:dados.id
        }).save()
        res.redirect('/lista?id='+dados.id)
    })

    app.get('/lista', async(req,res)=>{
        var user = req.query.id
        if(!user){
            res.redirect("/login")
        }
        var usuarios = require('../models/usuarios')
        var lista = require('../models/lista')

        var dadoUser = await usuarios.findOne({_id:user})

        var dadosAberto = await lista.find({usuario:user, status:"0"}).sort({data:1})

        var dadosEntregue = await lista.find({usuario:user, status:"1"}).sort({data:1})

        var dadosExcluido = await lista.find({usuario:user, status:"2"}).sort({data:1})

        res.render('lista.ejs',(
            {nome:dadoUser.nome, 
            id:dadoUser._id,
            dadosAberto,
            dadosEntregue,
            dadosExcluido
        }))
    })

    app.get('/excluir', async (req,res)=>{
        var doc = req.query.id
        var excluir = await lista.findOneAndUpdate(
            {_id:doc},
            {status:"2"}
        )
        res.redirect('/lista?id='+excluir.usuario)
    })

    //rota desfazer
    app.get('/desfazer',async(req,res)=>{
        //qual documento será devolvido da collection lista?
        var doc = req.query.id

        //excluir o documento
        var desfazer = await lista.findByIdAndUpdate(
            {_id:doc},
            {status:"0"}
        )

        //voltar para a lista de lista
        res.redirect("/lista?id="+desfazer.usuario)
    })

    app.get('/entregue',async(req,res)=>{
        var doc = req.query.id
        var entregue = await lista.findByIdAndDelete(
            {_id:doc},
            {status:"25"}
        )
        res.redirect("/lista?id="+entregue.usuario)
    })

    app.get("/alterar", async (req, res) => {
        //recuperar o id da dtividade
        var id = req.query.id
        //procurar o id na collection lista
        var alterar = await lista.findOne({ _id: id })
        //localizar o usuario proprietario da lista
        var user = await usuario.findOne({ _id: alterar.usuario })
        //renderizar a view alterar e enviar o nome e id do usuario e todos dados da atividade
        res.render("alterar.ejs", { nome: user.nome, id: user._id, alterar})
    })

    //gravar as alterações na atividade selecionada
    app.post("/alterar",async (req, res) =>{
        //armazenar as informações recebidas do formulário
        var dados = req.body
        console.log(dados)
        //atualizar o documento selecionado
        var atualizar = await lista.findOneAndUpdate(
            {_id:dados.id_a},
            {
                data:dados.data,
                titulo:dados.titulo,
                tipo:dados.tipo,
                observacao:dados.observacao
            }
        )
        //voltar para lista
        res.redirect('/lista?id='+dados.id_u)
    })

    app.get("/deletar", async(req, res) => {
        var id = req.query.id
        var deletar = await lista.findOne({_id:id})
        var user = await usuario.findOne({_id: deletar.usuario})
        res.render("deletar.ejs", {nome: user.nome, id: user._id, deletar})
    })

    app.post("/deletar",async (req, res) =>{
        var dados = req.body

        var excluido = await lista.findOneAndDelete(
            {_id:dados.id_a},
            {
                data:dados.data,
                titulo:dados.titulo,
                tipo:dados.tipo,
                observacao:dados.observacao
            }
        )
        //voltar para lista
        res.redirect('/lista?id='+dados.id_u)
    })


}