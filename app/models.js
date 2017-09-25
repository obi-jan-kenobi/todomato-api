'use strict'

const Sequelize = require('sequelize')
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

const Todo = sequelize.define('todo', {
  name: {
    type: Sequelize.STRING
  }
})

User.hasMany(Todo)

// force: true will drop the table if it already exists
User.sync()
Todo.sync()

module.exports =
  { User
  , Todo
  }
