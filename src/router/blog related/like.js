const express = require('express')
const mongoose = require('mongoose')
const router = new express.Router()

const Blog = require('../../models/blog_related/blog')
const Like = require('../../models/blog_related/like')
const auth= require('../../middleware/auth')

//add new like 
router.patch('/Like/:id', auth, async (req, res) => {
    try {
        const blog = await Blog.findOne({_id: req.params.id})
        if(!blog) {
            return res.status(404).send({'error': 'blog not found'})
        }

        const islikeExist = await Like.findOne({likee: req.user._id, blog: req.params.id})
        if (islikeExist) {
            return res.status(401).send()
        } 

        const newLike = new Like({likee: req.user._id, blog: req.params.id})
        await newLike.save()
        blog.likes = blog.likes + 1
        const totalLikes = blog.likes
        res.send({totalLikes, newLike})
    } catch (e) {
        res.status(500).send()
    }
})

//remove like 
router.delete('/Like/:id', auth, async(req, res) => {
    try {
        const blog = await Blog.findOne({_id: req.params.id})
        if(!blog) {
            return res.status(404).send({'error': 'blog not found'})
        }  

        const like = await Like.findOneAndDelete({likee: req.user._id, blog: req.params.id})
        if(!like) {
            return res.status(404).send()
        }

        blog.likes = blog.likes - 1
        const totalLikes = blog.likes
        res.send({totalLikes, like})
    } catch (e) {

    }
})

module.exports = router
