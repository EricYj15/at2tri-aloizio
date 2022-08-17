//importar as configurações do servidor
const req = require("express/lib/request")
const servidor = require("./config/servidor")
//carregar o express
const app = servidor.app
//carregar a porta
const porta = servidor.porta

//carregar a porta index
//const index = require('./routes/index')(app)

//importar o consign e configurar
const consign = require('consign')
consign().include('./routes').into(app)

//ligar o servidor
app.listen(porta)