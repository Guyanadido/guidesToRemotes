const mongoose = require('mongoose')

const likesSchema = mongoose.Schema({
    likee: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    blog: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'blog'
    },
}, {
    timestamps: true
})

const Likes = mongoose.model('likes', likesSchema)
module.exports = Likes