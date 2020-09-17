// import nodemailer from "nodemailer"
const nodemailer = require('nodemailer')
const config = require('../config/default.json')

const transporter = nodemailer.createTransport({
  host: 'mailcluster.loopia.se',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: config.user,
    pass: config.pass
  },
  tls: {
    rejectUnauthorized: false
  }
})
exports.transporter = transporter
const getPasswordResetURL = (user, token) => {
  //  `http://lend2friend.dk.se/api/mail/${user._id}/${token}`

  if (user.lang === 'en') {
    return `http://lend2friend.dk.se/en/settings/${user._id}/${token}/forgetPassword`
  }
  return `http://lend2friend.dk.se/settings/${user._id}/${token}/forgetPassword`
}
exports.getPasswordResetURL = getPasswordResetURL

const resetPasswordTemplate = (user, url) => {
  const from = 'no-reply@lend2friend.se'
  const to = user.email
  const subject = '🌻 lend2friend Password Reset 🌻'
  const html = `
  <p>Hey ${user.name || user.email},</p>
  <p>We heard that you lost your lend2friend password. Sorry about that!</p>
  <p>But don’t worry! You can use the following link to reset your password:</p>
  <a href=${url}>${url}</a>
  <p>If you don’t use this link within 1 hour, it will expire.</p>
  <p>Do something outside today! </p>
  <p>–Your friends at lend2friend</p>
  `

  return { from, to, subject, html }
}

const createPassword = (user) => {
  const from = 'no-reply@lend2friend.se'
  const to = user.email
  const subject = '🌻 Thanks for using lend2friend 🌻'
  const html = `
  <p>Hey ${user.name || user.email},</p>
  <p>Congrats for your first loan with Lend2friend!</p>
  <p>Please make sure to save your account details in safe place:</p>
  <p>E-mail: ${user.email}</p>
  <p>Password: ${user.password}</p>
  <p>Do something outside today! </p>
  <p>–Your friends at lend2friend</p>
  `

  return { from, to, subject, html }
}

exports.resetPasswordTemplate = resetPasswordTemplate
exports.createPasswordTemplate = createPassword
