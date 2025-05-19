const {Schema, model} = require('mongoose')

const moderatorSchema = new Schema({
    surname: String,
    name: String,
    secondname: String,
    login:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
})


module.exports = model('Moderators', moderatorSchema)