const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    temp15: {
        required: false,
        type: Number
    },
    hum15: {
        required: false,
        type: Number
    },
    
    dateInsertion:{
        required: false,
        type: Date
    }

    
})

module.exports = mongoose.model('graph', dataSchema);