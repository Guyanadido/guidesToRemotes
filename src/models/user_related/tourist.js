const mongoose = require('mongoose')

const touristSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    natinality: {
        type: String,
        trim: true,
    },
    preferences: [{
        preference: {
            type: String,
            trim: true,
        }
    }]
}, {
    timestamps: true
})

const Tourist = mongoose.model('tourist', touristSchema)

module.exports = Tourist

