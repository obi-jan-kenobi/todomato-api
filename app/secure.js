'use strict'

const secure = require('secure-password')

const pwd = secure()

class AuthError extends Error {
  constructor(message) {
    super(message)
    this.name('AuthError')
  }
}

exports.hash = (password) => new Promise((resolve, reject) => {
  const pw = Buffer.from(password)
  pwd.hash(pw, (err, hash) => {
    err ? reject(err) : resolve(hash)
  })
})

exports.validate = (password, hash) => new Promise((resolve, reject) => {
  const pw = Buffer.from(password)
  pwd.verify(pw, hash, (err, result) => {
    if (err) reject(err)

    if (result === secure.INVALID_UNRECOGNIZED_HASH) reject(new AuthError('unrecognized hash'))
    if (result === secure.INVALID) reject(new AuthError('invalid'))
    if (result === secure.VALID) resolve('valid')
  })
})
