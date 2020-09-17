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
const connectDB = require('./config/db')
connectDB()

// Require Rotues
const usersRoute = require('./routes/users_route')
const projectRoute = require('./routes/project_route')

// Assign Routes
app.use('/users', usersRoute)
app.use('/project', projectRoute)

// Export express app
module.exports = app

// Start standalone server if directly running
if (require.main === module) {
  const port = process.env.PORT || 3001
  app.listen(port, () => {
    console.log(`API server listening on port ${port}`)
  })
}
