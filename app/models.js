'use strict'

const sequelize = require('./sequelize')
const authentication = require('./authentication')

const User = sequelize.define('user', {
  email: {
    type: Sequelize.STRING
  },
  password: {
    type: Sequelize.STRING
  }
})

User.beforeCreate((user, options) =>
  authentication.hash(user.password)
    .then(hashedPw => { user.password = hashedPw })
    .catch(err => console.log(err))
)

// force: true will drop the table if it already exists
User.sync()

module.exports = User