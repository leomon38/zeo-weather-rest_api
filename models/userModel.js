const mongoose = require('mongoose')

const userDBSchema = new mongoose.Schema({
    username:  String, 
    favoriteCities: []
})

module.exports = mongoose.model('UserInfo', userDBSchema)