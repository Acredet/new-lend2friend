const bcrypt = require('bcrypt')

const { User, validate } = require('../models/user')
const { Project } = require('../models/project')
const { transporter, createPasswordTemplate } = require('../config/mail')

async function createUser (user, res) {
  // Check if valid user
  const { error } = validate(user)
  if (error) { return res.status(401).json(error.message) }

  // Check if the user existing
  const existingUser = await User.findOne({ email: user.email })
  if (existingUser) {
    return existingUser
  } else {
    try {
      // Generate Password
      const password = Math.random().toString(36).slice(-8)

      const salt = await bcrypt.genSalt(10)
      user.password = await bcrypt.hash(password, salt)

      // Create new User
      const borrower = await User.create(user)
      console.log('borrower: ', borrower)

      // Send account details to user's email
      user.password = password
      const emailTemplate2 = createPasswordTemplate(user)

      transporter.sendMail(emailTemplate2, (err) => {
        if (err) { res.status(500).json(`Error sending email: ${err}`) }
      })

      return borrower
    } catch (err) {
      res.status(500).json(err)
    }
  }
}

// DELETE BENETH CODE
exports.getAllProjects = async (req, res) => {
  await Project.find({})
    .then(projects => res.status(200).json(projects))
    .catch(err => res.status(400).json(err))
}

exports.deleteAllProjects = async (req, res) => {
  await Project.deleteMany({})
    .then(() => res.status(200).json({ msg: 'Deleted' }))
    .catch(err => res.status(200).json(err))
}
// DELETE UBOVE CODE
exports.addProject = async (req, res) => {
  const { taker, giver, loanAmount, amount, term, security, loanType, tableRows, InterestOnArrears: interestOnArrears, TermsOfDelay: termsOfDelay, paymentHolder } = req.body

  // Get users ids'
  const borrower = await createUser(taker, res)
  const lender = await createUser(giver, res)

  switch (amount.transferWay) {
    case 1: { // Cash
      amount.transferWay = 'via kontant överlämnande'
      amount.bank = null
      amount.bankAccountNumber = null
      amount.tel = null
      amount.mannar = null
      break
    }
    case 2: { // Bank acc
      amount.transferWay = 'via Insättning på bankkonto'
      amount.tel = null
      amount.mannar = null
      break
    }
    case 3: { // telefon
      amount.transferWay = 'via överföring med Swish till följande nummer'
      amount.bank = null
      amount.bankAccountNumber = null
      amount.mannar = null
      break
    }
    case 4: { // Another way
      amount.transferWay = 'på följande sätt'
      amount.bank = null
      amount.bankAccountNumber = null
      amount.tel = null
    }
  }

  if (!term.limited) { term.to = null }
  if (!security.exchange) { security.pledgedProperty = null }

  switch (loanType.promissoryNoteCover) {
    case 'Annuitetslån': { // Cash
      // For Second option
      loanType.installmentAmount = null
      loanType.interestRate = null
      loanType.firstPayment = null
      loanType.lastPayment = null
      // For Third option
      loanType.monthlyPayment = null
      loanType.thirdFirstPayment = null
      loanType.thirdLastPaymen = null
      break
    }
    case 'Rak amortering': {
      // For first option
      loanType.fixedAmount = null
      loanType.firstAnnuity = null
      loanType.lastAnnuity = null
      // For Third option
      loanType.monthlyPayment = null
      loanType.thirdFirstPayment = null
      loanType.thirdLastPaymen = null
      break
    }
    case 'Lån utan ränta': {
      // For first option
      loanType.fixedAmount = null
      loanType.firstAnnuity = null
      loanType.lastAnnuity = null
      // For Second option
      loanType.installmentAmount = null
      loanType.interestRate = null
      loanType.firstPayment = null
      loanType.lastPayment = null
    }
  }

  if (!termsOfDelay.shouldHeCancelLoan) {
    termsOfDelay.daysToPay = null
    termsOfDelay.shouldHePayInterestAfterLoanCancle = false
    termsOfDelay.percentage = null
  } else if (termsOfDelay.shouldHeCancelLoan && !termsOfDelay.shouldHePayInterestAfterLoanCancle) {
    termsOfDelay.percentage = null
  }

  if (!interestOnArrears.heShouldPay) { interestOnArrears.amount = null }

  const project = {
    borrower: borrower._id,
    lender: lender._id,
    loanAmount: {
      currency: loanAmount.currency,
      amount: Number(loanAmount.amount),
      date: loanAmount.date
    },
    amount,
    term,
    security,
    loanType,
    interestOnArrears,
    termsOfDelay,
    tableRows,
    paymentHolder
  }

  await Project.create(project)
    .then(newProject => res.status(201).json(newProject))
    .catch(err => res.status(400).json(err))
}

exports.getProject = async (req, res) => {
  await Project.findById(req.params.id)
    .then(project => res.status(200).json(project))
    .catch(err => res.status(400).json(err))
}

exports.getLenderProjects = async (req, res) => {
  console.log(req.user.id)
  await Project.find({ lender: req.user.id })
    .then(projects => res.status(200).json(projects))
    .catch(err => res.status(401).json(err))
}

exports.getBorrowerProjects = async (req, res) => {
  console.log(req.user.id)
  await Project.find({ borrower: req.user.id })
    .then(projects => res.status(200).json(projects))
    .catch(err => res.status(401).json(err))
}

exports.updateProject = async (req, res) => {
  const { index, val } = req.body
  const project = await Project.findById(req.params.id)
  if (project) {
    project.tableRows[index].status = val

    await project.save()
      .then(() => res.json({ success: true }))
      .catch(err => res.status(400).json(err))
  }
}

exports.deleteProject = async (req, res) => {
  await Project.findByIdAndDelete(req.params.id)
    .then(user => res.json({ success: true }))
    .catch(err => res.status(400).json(err))
}
