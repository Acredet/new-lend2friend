const express = require('express')
const auth = require('../middleware/auth')
const {
  getUser,
  addUser,
  getAllUsers,
  authenticate,
  deleteUser,
  deleteAll,
  getOneUser,
  updateUser
} = require('../controller/users_controller')
// const { User, validate } = require('../models/user')
const router = express.Router()

router.post('/', addUser)
router.get('/all', auth, getAllUsers)

router.get('/me', auth, getUser)
router.post('/auth', authenticate)
router.post('/logout', auth, (req, res) => res.status(200).json({ success: true }))

router.delete('/:id', auth, deleteUser)
router.patch('/:id', auth, updateUser)
router.get('/:id', auth, getOneUser)

router.delete('/', deleteAll)
module.exports = router
