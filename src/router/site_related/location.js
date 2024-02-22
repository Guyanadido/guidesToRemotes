const express = require('express')
const router = new express.Router()
const sharp = require('sharp')
const multer = require('multer')
const {image} = require('../../utils/imageAndGallery')

const Location = require('../../models/site_related/location')
const auth = require('../../middleware/auth')
const validate = require('../../utils/updateValidation')

//create new location
router.post('/Location', auth, image.array('gallery'), async(req, res) => {
    try {
        const sharpImages = req.files.map(async (file) => {
            return await sharp(file.buffer).png().toBuffer()
        })
        const images = await Promise(sharpImages)
        const location = new Location({...req.body})
        images.forEach(image =>location.images.concat({image}))
        await location.save()
        res.send(location)
    } catch (e) {
        res.status(500).send()
    }
})

//get multiple locations
// /Locations?sortBy=createdAt:desc?&page=1&limit=10
router.get('/Locations', async(req, res) => {
    try {
        const page = req.body.page || 1
        const limit = req.body.limit || 10
        const skip = (page - 1) * limit

        const sortBy = {}
        if(req.body.sortBy) {
            const [field, order] = req.body.sortBy.split(':')
            sortBy[field] = order === 'desc' ? -1 : 1
        }

        const locaions = await Location.find({})
            .sort(sortBy)
            .limit(limit)
            .skip(skip)
        res.send(locaions)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

//add new image item to the image field
router.patch('/Location/image/:id', auth, image.single('image'), async(req, res) => {
    try {
        const location = await Location.findById(req.params.id)
        if(!location) {
            return res.status(400).send({'error':'not found'})
        }
        image = await sharp(req.file).png().toBuffer()
        location.images.push({image})
        await location.save()
        res.send(location)
    } catch (e) {
        res.status(500).send(e.message)
    }
})


//edit Location
router.patch('/Location/:id', auth, async(req, res) => {
    if(!validate(req.body, ['name', 'description', 'tourTypes', 'latitude', 'longitude'])) {
        return res.status(401).send()
    }

    try {
        const location = await Location.findById(req.params.id)
        if(!location) {
            return res.status(401).send({'error':'an Authorised update'})
        }

        Object.keys(req.body).forEach(update => location[update] = req.body[update])
        await location.save()
        res.send(location)
    } catch (e) {
        res.status(500).send()
    }
})

//remove one item from location images field
router.delete('/Location/:locId/:imgId', auth, async(req, res) => {
    try {
        const location = await Location.findById(req.params.locId)
        if(!location) {
            return res.status(404).send({'error':'not found'})
        }
        location.images = location.images.filter(image => image._id.toString() !== req.params.imgId)
        await location.save()
        res.send(location)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

//delete location
router.delete('/Location/:id', auth, async(req, res) => {
    try {
        const location = await Location.findOneAndDelete({_id: req.params.id})
        if(!location) {
            return res.status(404).send({'error':'not found'})
        }
        res.send(location)
    } catch (e) {
        res.status(500).send(e.message)
    }
})