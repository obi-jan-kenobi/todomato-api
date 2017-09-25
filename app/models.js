'use strict'

const Sequelize = require('sequelize')
const sequelize = require('./sequelize')
const secure = require('./secure')

const User = sequelize.define('user', {
  email: {
    type: Sequelize.STRING
  },
  password: {
    type: Sequelize.STRING
  }
})

User.beforeCreate((user, options) =>
  secure.hash(user.password)
    .then(hashedPw => { user.password = hashedPw.toString() })
)

const Todo = sequelize.define('todo', {
  name: {
    type: Sequelize.STRING
  }
})

User.hasMany(Todo)

// force: true will drop the table if it already exists
User.sync({force: true})
Todo.sync()

module.exports =
  { User
  , Todo
  }
