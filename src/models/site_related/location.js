const mongoose = require('mongoose')

const locationSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    }, 
    description: {
        type: String,
        trim: true,
        required: true,
        maxLength: 200
    },
    images: [{
        image: {
            type: Buffer,
            required: true
        }
    }],
    tourTypes: [{
        tourType: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'tourTypes',
            required: true,
        }
    }],
    latitude: {
        type: mongoose.Types.Decimal128,
        required: true,
        trim: true
    },
    longitude: {
        type: mongoose.Types.Decimal128,
        required: true,
        trim: true
    }
})

const Location = mongoose.Schema('location', locationSchema)
module.exports = Location