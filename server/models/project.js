const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema({
  borrower: {
    type: String,
    required: true
  },
  lender: {
    type: String,
    required: true
  },
  loanAmount: {
    currency: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    date: {
      type: Date,
      required: true
    }
  },
  amount: {
    transferWay: {
      type: String,
      required: true
    },
    bank: String,
    bankAccountNumber: Number,
    tel: String,
    mannar: String
  },
  term: {
    limited: {
      type: Boolean,
      required: true
    },
    to: Date
  },
  security: {
    exchange: {
      type: Boolean,
      required: true
    },
    pledgedProperty: String
  },
  loanType: {
    promissoryNoteCover: String,
    repaidOften: String,
    fixedAmount: String,
    firstAnnuity: Date,
    lastAnnuity: Date,
    payOffAllTheLoan: Boolean,
    installmentAmount: String,
    interestRate: String,
    firstPayment: Date,
    lastPayment: Date,
    monthlyPayment: String,
    thirdFirstPayment: Date,
    thirdLastPayment: Date
  },
  interestOnArrears: {
    heShouldPay: {
      type: Boolean,
      required: true
    },
    amount: Number
  },
  termsOfDelay: {
    shouldHeCancelLoan: Boolean,
    daysToPay: String,
    shouldHePayInterestAfterLoanCancle: Boolean,
    percentage: String
  },
  tableRows: {
    type: [
      {
        manad: Number,
        bet: Number,
        amortering: Number,
        ranta: Number,
        status: {
          type: Boolean,
          default: false
        },
        dueDate: Date
      }
    ],
    required: true
  },
  paymentHolder: String
})

const Project = mongoose.model('Project', projectSchema)

exports.Project = Project
