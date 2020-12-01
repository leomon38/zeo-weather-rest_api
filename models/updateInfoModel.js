const mongoose = require('mongoose')


const datedInfoDBSchema = new mongoose.Schema({
    lastUpdate: {
        type: Number,
        required: true
    }, 
    lastUpdateGMTString: {
        type: String
    }
})

module.exports = mongoose.model('UpdateInfo', datedInfoDBSchema)
