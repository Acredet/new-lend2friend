export const state = () => ({
  preview: {
    loanAmount: {
      currency: 'SEK',
      date: new Date().toISOString().substr(0, 10)
    },
    amount: {
      transferWay: 1
    },
    term: {
      limited: false,
      to: new Date().toISOString().substr(0, 10)
    },
    security: {
      exchange: false
    },
    loanType: {
      promissoryNoteCover: 'Annuitetslån',
      repaidOften: 'vecka',
      firstAnnuity: new Date().toISOString().substr(0, 10),
      lastAnnuity: new Date().toISOString().substr(0, 10),
      payOffAllTheLoan: false,
      firstPayment: new Date().toISOString().substr(0, 10),
      lastPayment: new Date().toISOString().substr(0, 10),
      thirdFirstPayment: new Date().toISOString().substr(0, 10),
      thirdLastPayment: new Date().toISOString().substr(0, 10)
    },
    InterestOnArrears: {
      heShouldPay: false
    },
    TermsOfDelay: {
      shouldHeCancelLoan: false,
      shouldHePayInterestAfterLoanCancle: false
    },
    tableRows: [],
    paymentHolder: 'simple',
    pdf: ''
  }
})

export const mutations = {
  preview (state, updates) {
    state.preview = updates
  },
  tableRows (state, rows) {
    state.preview.tableRows = rows
  },
  pdf (state, link) {
    state.preview.pdf = link
  }
}

export const actions = {
  updatePreview ({ state, commit }, updates) {
    const loanUpadte = {
      taker: {
        name: updates.taker.name,
        SSN: updates.taker.SSN,
        address: updates.taker.address,
        tel: updates.taker.tel,
        email: updates.taker.email
      },
      giver: {
        name: updates.giver.name,
        SSN: updates.giver.SSN,
        address: updates.giver.address,
        tel: updates.giver.tel,
        email: updates.giver.email
      },
      loanAmount: {
        currency: updates.loanAmount.currency,
        amount: updates.loanAmount.amount,
        date: updates.loanAmount.date
      },
      amount: {
        transferWay: updates.amount.transferWay,
        bank: updates.amount.bank,
        bankAccountNumber: updates.amount.bankAccountNumber,
        tel: updates.amount.tel,
        mannar: updates.amount.mannar
      },
      term: {
        limited: updates.term.limited,
        to: updates.term.to
      },
      security: {
        exchange: updates.security.exchange,
        pledgedProperty: updates.security.pledgedProperty
      },
      loanType: {
        promissoryNoteCover: updates.loanType.promissoryNoteCover,
        repaidOften: updates.loanType.repaidOften,
        payOffAllTheLoan: updates.loanType.payOffAllTheLoan,
        // For first option
        fixedAmount: updates.loanType.fixedAmount,
        firstAnnuity: updates.loanType.firstAnnuity,
        lastAnnuity: updates.loanType.lastAnnuity,
        // For Second option
        installmentAmount: updates.loanType.installmentAmount,
        interestRate: updates.loanType.interestRate,
        firstPayment: updates.loanType.firstPayment,
        lastPayment: updates.loanType.lastPayment,
        // For Third option
        monthlyPayment: updates.loanType.monthlyPayment,
        thirdFirstPayment: updates.loanType.thirdFirstPayment,
        thirdLastPayment: updates.loanType.thirdLastPayment
      },
      InterestOnArrears: {
        heShouldPay: updates.InterestOnArrears.heShouldPay,
        amount: updates.InterestOnArrears.amount
      },
      TermsOfDelay: {
        shouldHeCancelLoan: updates.TermsOfDelay.shouldHeCancelLoan,
        daysToPay: updates.TermsOfDelay.daysToPay,
        shouldHePayInterestAfterLoanCancle: updates.TermsOfDelay.shouldHePayInterestAfterLoanCancle,
        percentage: updates.TermsOfDelay.percentage
      },
      tableRows: state.preview.tableRows,
      paymentHolder: updates.paymentHolder
    }

    commit('preview', loanUpadte)
  },
  updateRows ({ commit }, rows) {
    commit('tableRows', rows)
  },
  updatePdfLink ({ commit }, link) {
    commit('pdf', link)
  }
}

export const getters = {
  preview (state) {
    return state.preview
  },
  rows (state) {
    return state.preview.tableRows
  }
}
