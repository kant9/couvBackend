const mongoose = require('mongoose');


const dataSchema = new mongoose.Schema({
    temp: {
        required: false,
        type: Number
    },
    hum: {
        required: false,
        type: Number
    },
    
    dateInsertion:{
        required: false,
        type: Date
    }

    
})


module.exports = mongoose.model('serre', dataSchema);

