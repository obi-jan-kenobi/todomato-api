const secure = require('../secure')
const expect = require('chai').expect

describe('hashing', () => {
  it('should hash the given string', () =>
    secure
      .hash('password')
      .then(hash => expect(hash).to.not.equal('password')))
  })
  it('should be able to verify the password', () =>
    secure
      .hash('password')
      .then(hash => secure.validate('password', hash.toString()))
      .then(result => expect(result).to.be.equal('valid'))
)

