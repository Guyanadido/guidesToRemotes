const express = require('express')
const router = new express.Router()

const multer = require('multer')
const sharp = require('sharp')
const Filter = require('bad-words')

const blogSearchQuery = require('../../utils/blogSearchQuery')
const Blog = require('../../models/blog_related/blog')
const auth = require('../../middleware/auth')

//post a new blog
router.post('/blog', auth, async (req, res) => {
    const filter = new Filter()
    if (filter.isProfane(req.body.title) || filter.isProfane(req.body.excerpt)) {
        return res.status(400).send({ "error": "profanity not allowed" })
    }

    const blog = new Blog({ ...req.body, guide: req.user._id })
    try {
        await blog.save()
        res.send(blog)
    } catch (e) {
        res.status(500).send()
    }
})

//get a single blog
router.get('/blog/:id', auth, async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id)
        if (!blog) {
            return res.status(404).send({ 'error': 'blog not found' })
        }

        res.send(blog)
    } catch (e) {
        res.status(500).send()
    }
})

// get multiple blogs
router.get('/Blogs', auth, async (req, res) => {
    try {
        const query = blogSearchQuery(req.query)
        const blogs = await Blog.find(query)
        res.send(blogs)
    } catch (e) {
        res.status(500).send('error', e.message)
    }
})

//edit blog content
router.patch('/blog/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['content', 'excerpt', 'title', 'catagories', 'placesFeatured', 'tags']
    const isValid = updates.every(update => allowedUpdates.includes(update))

    if (!isValid) {
        return res.status(404).send({ 'error': 'invalid update' })
    }

    try {
        const blog = await Blog.findOne({ _id: req.params.id, guide: req.user._id })
        if (!blog) {
            return res.status(401).send({ 'error': 'unable to update' })
        }
        updates.forEach(update => blog[update] = req.body[update])
        await blog.save()
        res.send(blog)
    } catch (e) {
        res.status(500).send()
    }
})


//delete a blog
router.delete('/blog/:id', auth, async (req, res) => {
    try {
        const blog = await Blog.findOneAndDelete({ _id: req.params.id, guide: req.user._id })
        if (!blog) {
            return res.status(404).send({ 'errror': 'not found' })
        }
        res.send(blog)
    } catch (e) {
        res.status(400).send()
    }
})

//delete all blogs
router.delete('/blogs', auth, async (req, res) => {
    try {
        const deleteResult = await Blog.deleteMany({ guide: req.user._id })

        if (deleteResult.deletedCount === 0) {
            return res.status(404).send({ 'error': 'No blog yet' })
        }

        res.send({ 'message': `${deleteResult.deletedCount} blogs are deleted` })
    } catch (e) {
        res.status(400).send()
    }
})

const featuredImg = multer({
    limits: {
        fileSize: 20000000
    },

    fileFilter(req, file, cd) {
        if (!file.originalname.match(/\.(jpg||jpej||png)$/)) {
            return cd(new Error('upload an image'))
        }

        cd(undefined, true)
    }
})

//upload a featured image
router.post('/blog/featuredImg/:id', auth, featuredImg.single('featuredImg'), async (req, res) => {
    try {
        const blog = await Blog.findOne({ _id: req.params.id, guide: req.user._id })
        if (!blog) {
            return res.status(404).send({ 'error': 'blog not found' })
        }

        const imageBuffer = await sharp(req.file.buffer).png().toBuffer()
        blog.featured_img = imageBuffer
        await blog.save()
        res.send(blog)
    } catch (e) {
        res.status(500).send()
    }
})

const gallery = multer({
    limits: {
        fileSize: 20000000,
    },

    fileFilter(req, file, cb) {
        if ((file.size > 20000000)) {
            return cb(new Error('size limit passed'))
        }

        if (!file.mimetype.startsWith('image/') && !file.mimetype.startsWith('video/')) {
            return cb(new Error('upload a video or image'))
        }

        cb(undefined, true)
    }
})

//upload a gallery 
router.post('/blog/gallery/:id', auth, gallery.array('gallery', 5), async (req, res) => {
    try {
        const blog = await Blog.findOne({ _id: req.params.id, guide: req.user._id })
        if (!blog) {
            return res.status(404).send({'error':'blog not found'})
        }

        const gallary = req.files.map(async (file) => {
            if (file.mimetype.startsWith('image/')) {
                return await sharp(file.buffer).png().toBuffer()
            } else if (file.mimetype.startsWith('video/')) {
                return file.buffer
            } 
        })

        const formattedGallery = await Promise.all(gallary)

        formattedGallery.forEach(async (item) => {
            await blog.gallery.push({item})
        })

        await blog.save()
        res.send(blog)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router