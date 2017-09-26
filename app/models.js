'use strict'

const Sequelize = require('sequelize')
const sequelize = require('./sequelize')
const secure = require('./secure')

const User = sequelize.define('user', {
  email: {
    type: Sequelize.STRING
  },
  password: {
    type: Sequelize.STRING.BINARY
  }
})

User.beforeCreate((user, options) =>
  secure.hash(user.password)
    .then(hashedPw => { user.password = hashedPw })
)

const Todo = sequelize.define('todo', {
  name: {
    type: Sequelize.STRING
  }
})

User.hasMany(Todo)

// force: true will drop the table if it already exists

User
  .sync({force: process.env.NODE_ENV === 'development'})
  .then(() =>
    Todo
      .sync({force: process.env.NODE_ENV === 'development'}))


module.exports =
  { User
  , Todo
  }
