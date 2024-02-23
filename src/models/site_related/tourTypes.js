const mongoose = require('mongoose')

const tourTypesSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    }, 
    description: {
        type: String,
        required: true,
        trim: true,
        minLength: 10,
        maxLength: 100,
    },
    keywords: [{
        keyword: {
            type: String,
            trim: true,
        }
    }],
    image: {
        type: Buffer,
    },
    relatedLocations: {
        type: [{type: String, ref: 'location'}]
    }
}, {
    timestamps: true
})

const TourTypes = mongoose.model('tourTypes', tourTypesSchema)

module.exports = TourTypes