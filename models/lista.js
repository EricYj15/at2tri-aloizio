const mongoose = require('mongoose')

const modelo = mongoose.Schema({
    titulo:String,
    data: Date,
    tipo: String,
    observacao: String,
    usuario: String,
    status:{type:String, default:0}
})

const lista = mongoose.model('lista',modelo)

module.exports = lista