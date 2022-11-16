const express = require('express')
const app = express()
const mongoose = require('mongoose')
const saucesRoutes = require('./routes/sauces')
const usersRoutes = require('./routes/users')
const path = require('path')


mongoose.connect('mongodb+srv://DilhanC:YBLD5yV7rKOfRcXp@cluster0.e9v1s16.mongodb.net',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'))

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
  next()
})

app.use(express.json())
 
app.use('/api/stuff', saucesRoutes)
app.use('/api/auth', usersRoutes)
app.use('/images', express.static(path.join(__dirname, 'images')))

module.exports = app 