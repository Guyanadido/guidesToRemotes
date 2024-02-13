const mongoose = require('mongoose')

const tourSchema = mongoose.Schema({
    guide: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'guides'
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
        minLength: 100,
    },
    locations: [{
        location: {
            type: String,
            required: true,
            trim: true,
        }
    }],
    price: {
        type: Number,
        required: true,
    },
    capacity: {
        type: Number,
        required: true,
        min: 0
    },
    startDate: {
        type: Date,
        required: true,
        min: Date.now()
    },
    endDate: {
        type: Date,
        required: true,
        min: Date.now()
    },
    images: [{
        image: {
            type: Buffer,
        }
    }],
    tourTypes: [{
        tourType: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'tourTypes'
        }
    }]
}, {
    timestamps: true
})

tourSchema.virtual('reviews', {
    ref: 'review',
    localField: '_id',
    foreignField: 'tourPackage'
})

const tourPackages = mongoose.model('tourPackage', tourSchema)
module.exports = tourPackages