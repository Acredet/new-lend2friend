const express = require('express')
const auth = require('../middleware/auth')

const {
  deleteAllProjects, // TODO: DELETE BEFORE PRODUCTION
  getAllProjects, // TODO: DELETE BEFORE PRODUCTION
  addProject,
  getProject,
  updateProject,
  deleteProject,
  getLenderProjects,
  getBorrowerProjects,
  getOverDateProjects
} = require('../controller/project_controller')

const router = express.Router()

router
  .route('/')
  .get(getAllProjects) // TODO: DELETE BEFORE PRODUCTION
  .delete(deleteAllProjects) // TODO: DELETE BEFORE PRODUCTION
  .post(addProject)

router
  .route('/:id', auth)
  .get(getProject)
  .patch(updateProject)
  .delete(deleteProject)

router.get('/loans/lender', auth, getLenderProjects)
router.get('/loans/borrower', auth, getBorrowerProjects)
router.get('/loans/overdateloan', auth, getOverDateProjects)

module.exports = router
