const express = require('express')
const app = express()
const mongoose = require('mongoose')
const saucesRoutes = require('./routes/sauces')
const usersRoutes = require('./routes/users')
const path = require('path')
const cors = require('cors')
require('dotenv').config()
app.use(cors())
const mongoSanitize = require('express-mongo-sanitize')
const rateLimit = require('express-rate-limit')
const helmet = require("helmet")

app.use(helmet({
	crossOriginEmbedderPolicy: false,
	crossOriginResourcePolicy: false,
}))

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 200, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

// Apply the rate limiting middleware to all requests
app.use(limiter)

app.use(mongoSanitize())

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/?retryWrites=true&w=majority`,
{ useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'))

app.use(express.json())

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
  next()
})
 
app.use('/api/sauces', saucesRoutes)
app.use('/api/auth', usersRoutes)
app.use('/images', express.static(path.join(__dirname, 'images')))

module.exports = app