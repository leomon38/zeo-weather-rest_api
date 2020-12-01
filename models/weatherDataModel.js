const mongoose = require('mongoose')

const weatherDBSchema = new mongoose.Schema({
    zipcode:  String,
    region: {
        city: String,
        geopoint: [],
        state: String
    },   
    data: []
})

module.exports = mongoose.model('Weather', weatherDBSchema)
