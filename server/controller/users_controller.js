const bcrypt = require('bcrypt')
const _ = require('lodash')
const jwt = require('jsonwebtoken')
// const { User, validate } = require('../models/user')
const { User } = require('../models/user')
require('dotenv')

// @desc  Get a user
// @route GET /api/users/me
// @access Private
exports.getUser = async (req, res, next) => {
  const user = await User.findById(req.user.id).select('-password')
  res.status(200).json({
    success: true,
    ResultsNumber: user.length,
    data: user
  })
}

exports.getOneUser = async (req, res) => {
  await User.findById(req.params.id)
    .then(user => res.status(200).json(user))
    .catch(err => res.status(400).json(err))
}

// @desc  Get all users
// @route GET /api/users
// @access Private
exports.getAllUsers = async (req, res, next) => {
  try {
    await User.find({}).then(users =>
      res.status(200).json({
        success: true,
        ResultsNumber: User.length,
        data: users
      })
    )
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}

// @desc  Create a User
// @route POST /api/users
// @access Public
exports.addUser = async (req, res) => {
  try {
    // const { error } = validate(req.body)
    // if (error) { return res.status(400).send(error.details[0].message) }

    let user = await User.findOne({ email: req.body.email })
    if (user) { return res.status(400).send('User already registered.') }

    user = new User(_.pick(req.body, ['name', 'email', 'password']))
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(user.password, salt)
    await user.save()
    const token = user.generateAuthToken()
    res
      .header('x-auth-token', token)
      .send(_.pick(user, ['_id', 'name', 'email']))
  } catch (err) {
    console.log(err)
  }
}
// @desc  Create a User
// @route POST /api/users
// @access Public
exports.authenticate = async (req, res) => {
  const { email, password } = req.body
  // Simple validation
  if (!email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' })
  }

  // Check for existing user
  await User.findOne({ email }).then((user) => {
    if (!user) { return res.status(400).json({ msg: 'User Does not exist' }) }
    // Validate password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (!isMatch) { return res.status(400).json({ msg: 'Invalid credentials' }) }

      jwt.sign(
        { id: user.id },
        process.env.jwtPrivateKey,
        { expiresIn: 36000 },
        (err, token) => {
          if (err) { throw err }
          res.json({
            token,
            user: {
              id: user.id,
              admin: user.isAdmin,
              name: user.name,
              email: user.email
            }
          })
        }
      )
    })
  })
}

// @desc  Delete a User
// @route Delete /api/User/id
// @access Private
exports.deleteUser = (req, res) => {
  User.findById(req.params.id)
    .then(user => user.remove().then(() => res.status(200).json({ success: true })))
    .catch(err => res.status(404).json(err.message))
}

// @desc  update a User
// @route update /api/User/id
// @access Private
exports.updateUser = (req, res) => {
  User.updateOne({ _id: req.params.id }, { $set: req.body })
    .then(user => res.json({ success: true }))
    .catch(err => res.status(404).json(err.message))
}

exports.deleteAll = (req, res) => {
  User.deleteMany()
    .then(() => res.json({ success: true }))
    .catch(err => res.status(404).json(err.message))
}
