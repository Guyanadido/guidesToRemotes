const mongoose = require('mongoose')

const languageSchema = mongoose.Schema({
    languageName: {
        type: String,
        required: true,
        trim: true,
    },
    code: {
        type: String,
        maxLength: 3,
        trim: true,
        default: null,
        unique: true,
        sparse: true,
    }
})

const Language = mongoose.model('language', languageSchema)

module.exports = Language