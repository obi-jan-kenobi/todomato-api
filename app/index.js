'use strict'

const Koa = require('koa')
const jwt = require('koa-jwt')

const app = new Koa()

const sequelize = require('./sequelize')

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

// protected

app.use(jwt({ secret: process.env.SECRET }))

app.use(async ctx => {
  ctx.body = 'Hello World'
})

sequelize
  .authenticate()
  .then(() => app.listen(process.env.PORT))
  .catch(err => console.log('couldnt connect to database'))
