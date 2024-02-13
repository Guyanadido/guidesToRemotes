const mongoose = require('mongoose')

const guideSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    expertInTourTypes: [{
        tourTypes: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'tourTypes'
        }
    }],
    availability: [{
        available: {
            startDate: {
                type: Date,
                default: Date.now(),
                min: Date.now()
            },
            endDate: {
                type: Date,
                min: Date.now()
            }
        }
    }],
    gallery: [{
        image: {
            type: Buffer
        }
    }]
}, {
    timestamps: true
})

guideSchema.virtual('qualifications', {
    ref: 'qualifications',
    localField: '_id',
    foreignField: 'guide'
})

guideSchema.virtual('tourPackages', {
    ref: 'tourPackage',
    localField: '_id',
    foreignField: 'guide'
})

guideSchema.virtual('reviews', {
    ref: 'review',
    localField: '_id',
    foreignField: 'guide'
})

const Guides = mongoose.model('guides', guideSchema)

module.exports = Guides