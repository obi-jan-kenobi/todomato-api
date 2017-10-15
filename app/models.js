'use strict'

const Sequelize = require('sequelize')
const sequelize = require('./sequelize')
const secure = require('./secure')


/**
 * Our User-Model with unique id, email and password fields
 */
const User = sequelize.define('user', {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV1,
  },
  email: {
    type: Sequelize.STRING,
    unique: true,
  },
  password: {
    type: Sequelize.STRING.BINARY
  }
})

/**
 * User-Models before-create hook to save the given password hashed
 */

User.beforeCreate((user, options) =>
  secure.hash(user.password)
    .then(hashedPw => { user.password = hashedPw })
)


/**
 * Todo-Model with name field
 */
const Todo = sequelize.define('todo', {
  name: {
    type: Sequelize.STRING
  }
})


/**
 * One-to-Many relation from User to Todo
 */
User.hasMany(Todo)

// force: true will drop the table if it already exists (dev-mode)
User
  .sync({force: process.env.NODE_ENV === 'development'})
  .then(() =>
    Todo
      .sync({force: process.env.NODE_ENV === 'development'}))


module.exports =
  { User
  , Todo
  }
