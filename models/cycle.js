const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    nombre: {
        required: true,
        type: String
    },
    espece: {
        required: true,
        type: String
    },
    taux: {
        required: false,
        type: Number
    },
    numcycle: {
        required: true,
        type: String
    },
    dateInsertion:{
        required: false,
        type: Date
    }
})

module.exports = mongoose.model('cycle', dataSchema);