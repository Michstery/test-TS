import express from 'express';
const router = express.Router()

const userRouter = require('./users')

router.use('/', userRouter)

module.exports = router