'use strict'

const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const jwt = require('koa-jwt')
const jsonwebtoken = require('jsonwebtoken')

const app = new Koa()

const secret = process.env.SECRET

const sequelize = require('./sequelize')

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

app.use(async (ctx, next) => {
  if (ctx.path !== '/login') return await next()
  try {
    const { username, password } = ctx.request.body
    if (username === 'username' && password === 'password')
      return ctx.body = jsonwebtoken.sign({user: 'john.doe'}, secret)
  } catch (err) {
    throw err
  }
})

// protected

app.use(jwt({ secret: process.env.SECRET }))

sequelize
  .authenticate()
  .then(() => app.listen(process.env.PORT))
  .catch(err => console.log('couldnt connect to database'))
