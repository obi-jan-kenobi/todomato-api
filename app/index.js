'use strict'

const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const jwt = require('koa-jwt')
const jsonwebtoken = require('jsonwebtoken')
const secure = require('./secure')
const sequelize = require('./sequelize')
const { User, Todo } = require('./models')

const app = new Koa()

const secret = process.env.SECRET

app.use(bodyParser())

app.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    if (401 == err.status) {
      ctx.status = 401
      ctx.body = 'Protected resource, use Authorization header to get access'
    } else {
      throw err
    }
  }
})

// unprotected (login & register)

// login
app.use(async (ctx, next) => {
  if (ctx.path !== '/login') return await next()
  try {
    const { email, password } = ctx.request.body
    const user = await User.findOne({
      where: {
        email
      }
    })
    if (!user) return ctx.status = 401
    if (secure.validate(password, user.password))
      return ctx.body = jsonwebtoken.sign({email}, secret)
  } catch (err) {
    throw err
  }
})

// register
app.use(async (ctx, next) => {
  if (ctx.path !== '/register') return await next()
  try {
    const { email, password } = ctx.request.body
    const user = await User.find({
      where: {
        email
      }
    })
    if (user) return ctx.status = 409
    await User.create({
      email,
      password
    })
    ctx.status = 201
  } catch (err) {
    err.status(500)
    throw err
  }
})

// protected
app.use(jwt({ secret: process.env.SECRET }))

// todos route
app.use(async (ctx, next) => {
  if (ctx.path !== '/todos') return await next()
  try {
    const { email } = ctx.state.user
    if (ctx.method === 'GET') {
      const user = await User.find({
        where: {
          email
        }
      })
      const todos = await user.getTodos()
      ctx.body = todos.map(todo => ({id: todo.id, name: todo.name}))
    }
    if (ctx.method === 'POST') {
      const user = await User.find({
        where: {
          email
        }
      })
      const {name} = ctx.request.body
      const todo = await Todo.create({
        name
      })
      await user.addTodo(todo)
      ctx.status = 201
    }
  } catch (err) {
    err.status = 500
    throw err
  }
})

sequelize
  .authenticate()
  .then(() => app.listen(process.env.PORT))
  .catch(err => console.log('couldnt connect to database'))
