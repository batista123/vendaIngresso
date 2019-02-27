//carregando modulos:
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require("body-Parser")
const mongoose = require("mongoose")
const app = express()
const admin = require("./routes/admin")
const path = require("path")
const session = require("express-session")
const flash = require("connect-flash")
const Produto = mongoose.model("produtos")
require("./models/Produto")
const usuarios = require("./routes/usuario")
const passport = require("passport")
require("./config/auth")(passport)
require("./routes/usuario")


//configurações
//sessão
        app.use(session({
            secret: "cursodenode",
            resave: true,
            saveUninitialized: true
        }))

        app.use(passport.initialize())
        app.use(passport.session())
        app.use(flash())
//middleware
        app.use((req,res,next)=>{
            res.locals.success_msg = req.flash("success_msg")
            res.locals.error_msg = req.flash("error_msg")
            res.locals.error = req.flash("error")
            res.locals.user = req.user || null;
            next()
        })

//body parser
    app.use(bodyParser.urlencoded({extend:true}))
    app.use(bodyParser.json())

//handlebars
    app.engine('handlebars',handlebars({defaultLayout: 'main'}))
    app.set('view engine','handlebars');
//mongoose
    mongoose.Promise = global.Promise;
    mongoose.connect("mongodb://localhost/blogapp").then(()=>{
        console.log("conectado ao mongo")
    }).catch((err)=>{
        console.log("erro ao se conectar:"+err)
    })
//public
    app.use(express.static(path.join(__dirname,"public")) )
    
//rotas
app.post('/login', passport.authenticate('local', { successRedirect: '/',
                                                    failureRedirect: 'usuarios/login' }));

app.use('/admin',admin)
app.use("/usuarios",usuarios)

app.get('/',(req,res)=>{
res.render("index")
})

app.use("/categorias",(req,res)=>{
Produto.find().then((produtos) => {
    res.render("produtos/index",{produtos: produtos}
    )
}).catch((err) => {
    req.flash("error_msg","Houve um erro interno ao listar as categorias")
    res.redirect("/")
})
})


app.use("/categorias/deletar",(req,res)=>{
Produto.remove({_id: req.body.id}).then(()=>{
    req.flash("sucess_msg","categoria deletada com sucesso!")
    res.redirect("/categorias")
}).catch((err)=>{
    req.flash("error_msg","houve um erro ao deletar a categoria")
    res.redirect("/categorias")
})
})



//outros
const PORT = 3001
app.listen(PORT,()=>{
console.log("servidor rodando")
})
