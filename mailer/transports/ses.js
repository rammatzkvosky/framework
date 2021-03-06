'use strict'

const Nodemailer = require('nodemailer')
const SES = require('aws-sdk/clients/ses')

/**
 * Creates the SES transporter for Nodemailer
 * based on the application's configuration.
 */
class SesTransporter {
  constructor (options) {
    return Nodemailer.createTransport({
      SES: new SES(options)
    })
  }
}

module.exports = SesTransporter
