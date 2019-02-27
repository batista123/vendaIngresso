const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Produto")
const Produto = mongoose.model("produtos")
const {eAdmin} = require("../helpers/eAdmin")


router.get('/',eAdmin, (req,res)=>{
      res.render("admin/index")
   })

router.get('/',(req,res)=>{
    res.send("página principal do painel ADM")
})

router.get('/posts',eAdmin,(req,res)=>{
    res.send("página de posts")
})

router.get('/categorias',(req,res)=>{
    Produto.find().then((produtos)=>{
        res.render("admin/categorias",{produtos: produtos})
    }).catch((err)=>{
        req.flash("error_msg","houve um erro ao listar as categorias")
        res.redirect("/admin")
})
})


router.get('/categorias/add',eAdmin,(req,res)=>{
    res.render("admin/addcategorias")
})

    



router.post("/categorias/nova",eAdmin,(req,res)=>{
    //validando um formulário
    var erros =[]
    if(!req.body.nome || typeof req.body.nome ==undefined || req.body.nome == null){
        erros.push({texto: "Nome inválido"})
    }
    if(!req.body.preço || typeof req.body.preço ==undefined || req.body.preço == null){
        erros.push({texto: "valor inválido"})
    }
    if(req.body.nome.length <2){
        erros.push({texto: "Nome do produto é muito pequeno"})
    }
    if(erros.length>0){
        res.render("admin/addcategorias",{erros})
    }else{
        const novoProduto ={
            nome: req.body.nome,
            preço: req.body.preço,
            horário: req.body.horário
        }
        new Produto(novoProduto).save().then(()=>{
            req.flash("success_msg", "produto criado com sucesso!")
            res.redirect("/admin/categorias")
            }).catch((err)=>{
            req.flash("error_msg","houve um erro")
            res.redirect("/admin")
        })
    }
 
})


router.get("/categorias/edit/:id",eAdmin,(req,res)=>{
    Produto.findOne({_id:req.params.id}).then((produto)=>{
        res.render("admin/editcategorias",{produto: produto})
    }).catch((err)=>  {
        req.flash("error_msg","Esse Produto não existe")
        res.redirect("/admin/categorias")
    })
})




router.get('/categorias/nova',eAdmin,(req,res)=>{
    res.render("admin/addcategorias")
})

//router.get('/categorias/compra',eAdmin,(req,res)=>{
    //res.render("/index")
//})

router.post("/categorias/edit",eAdmin,(req,res)=>{
    Produto.findOne({_id: req.body.id}).then((produto)=>{
        produto.nome= req.body.nome
        produto.preço= req.body.preço
        produto.horário= req.body.horário
        produto.save().then(()=>{
            req.flash("sucess_msg","produto editado com sucesso")
            res.redirect("/admin/categorias")
        }).catch((err)=>{
            req.flash("error_msg","houve um erro interno ao salvar a edição do produto")
            res.redirect("/admin/categorias")
        })

    }).catch((err)=>{
        req.flash("error_msg","houve um erro ao editar o produto")
        res.redirect("/admin/categorias")
    })
})




router.post("/categorias/deletar",eAdmin,(req,res)=>{
    Produto.remove({_id: req.body.id}).then(()=>{
        req.flash("sucess_msg","Ingresso deletado com sucesso!")
        res.redirect("/admin/categorias")
    }).catch((err)=>{
        req.flash("error_msg","houve um erro ao deletar o ingresso")
        res.redirect("/admin/categorias")
})
})

module.exports = router 