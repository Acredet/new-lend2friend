// const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')

dotenv.config()

const app = express()

// Bodyparser Middleware  cors
app.use(cors())
app.use(express.json({ extended: true }))
app.use(express.urlencoded({ extended: true }))

// Connect to db
const { Nuxt, Builder } = require('nuxt')
const nuxtConfig = require('../nuxt.config.js')
const connectDB = require('./config/db')
connectDB()

// Require Rotues
const usersRoute = require('./routes/users_route')
const projectRoute = require('./routes/project_route')

// Assign Routes
app.use('/api/users', usersRoute)
app.use('/api/project', projectRoute)

// Import and Set Nuxt.js options
nuxtConfig.dev = process.env.NODE_ENV !== 'production'

app.use(express.json({ extended: true }))
app.use(express.urlencoded({ extended: true }))

async function start () {
  // Init Nuxt.js
  const nuxt = new Nuxt(nuxtConfig)
  // const { host, port } = nuxt.options.server;
  await nuxt.ready()
  // Build only in dev mode
  if (nuxtConfig.dev) {
    console.log('building')
    const builder = new Builder(nuxt)
    await builder.build()
  }
  // Give nuxt middleware to express
  app.use(nuxt.render)
  // Listen the server
  const port = process.env.PORT || 3001
  app.listen(port)

  console.log(`Server listening on port:${port}`)
}
start()
