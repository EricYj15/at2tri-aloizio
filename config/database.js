const mongoose = require('mongoose')

const conn = async() => {
    //mongoAtlas
    const atlas = await mongoose.connect('mongodb+srv://userRevisao:15102005@fiaptecnico.eftcw.mongodb.net/test')
}

module.exports = conn