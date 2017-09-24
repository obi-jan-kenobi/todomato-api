'use strict'

const secure = require('secure-password')

const pwd = secure()

class AuthError extends Error {
  constructor(message) {
    super(message)
    this.name('AuthError')
  }
}

const register = async (username, password) => {
  
}

const authenticate = async (username, password) => {
  try {
    const validation = await validate(password, hash)
  } catch (err) {

  }
}

const hash = (password) => new Promise((resolve, reject) => {
  const pw = Buffer.from(password)
  pwd.hash(pw, (err, hash) => {
    err ? reject(err) : resolve(hash)
  })
})

const validate = (password, hash) => new Promise((resolve, reject) => {
  const pw = Buffer.from(password)
  pwd.verify(pw, hash, (err, result) => {
    if (err) reject(err)

    if (result === secure.INVALID_UNRECOGNIZED_HASH) reject(new AuthError('unrecognized hash'))
    if (result === secure.INVALID) reject(new AuthError('invalid'))
    if (result === secure.VALID) resolve('valid')
  })
})
