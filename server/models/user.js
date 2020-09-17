const jwt = require('jsonwebtoken')
const Joi = require('@hapi/joi')
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  tel: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  SSN: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
})

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    process.env.jwtPrivateKey
  )
  return token
}

const User = mongoose.model('User', userSchema)

function validateUser (user) {
  const userSchema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    tel: Joi.string().min(8).max(20),
    address: Joi.string().min(5).max(355),
    SSN: Joi.string().min(8).max(20)
  })

  return userSchema.validate(user)
}

exports.User = User
exports.validate = validateUser
