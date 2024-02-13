const mongoose = require('mongoose')

const subCommentSchema = mongoose.Schema({
    commentor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    content: {
        type: String,
        required: true,
        trim: true,
        maxLength: 10000,
    }
}, {
    timestamps: true
}, {
    _id: false
})

const commentSchema = mongoose.Schema({
    blog: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'blog',
        required: true
    },
    commentor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    content: {
        type: String,
        required: true,
        trim: true,
        maxLength: 10000,
    },
    replys: [subCommentSchema],
}, {
    timestamps: true
})

const Comment = mongoose.model('comment', commentSchema)

module.exports = Comment