const express = require('express')
require('./db/mongoose')
const app = express()
const userRouter = require('./router/user_related/user')
// const guideRouter = require('./router/user_related/guide')
const blogRouter = require('./router/blog related/blog')
const likeRouter = require('./router/blog related/like')

app.use(express.json())
app.use(blogRouter)
app.use(userRouter)
app.use(likeRouter)
// app.use(guideRouter)

const port = process.env.PORT || 3000

app.get('/', (req, res) => {
    res.send('hey')
})

app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})