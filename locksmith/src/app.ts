import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import tracing from '@opencensus/nodejs'
import { JaegerTraceExporter } from '@opencensus/exporter-jaeger'
import { ApolloServer } from 'apollo-server-express'
import { typeDefs } from './graphql/typeDefinitions'
import { resolvers } from './graphql/resolvers'

const config = require('../config/config')

const exporter = new JaegerTraceExporter(config.jaeger)

if (process.env.NODE_ENV != 'test') {
  tracing.start({ exporter: exporter })
}

const app = express()

const server = new ApolloServer({
  typeDefs,
  resolvers,
})
server.applyMiddleware({ app })

let transactionRouter = require('./routes/transaction')
let lockRouter = require('./routes/lock')
let blockRouter = require('./routes/block')
let userRouter = require('./routes/user')
let eventRouter = require('./routes/event')
let purchaseRouter = require('./routes/purchase')
let priceRouter = require('./routes/price')
let metadataRouter = require('./routes/metadata')
let healthCheckRouter = require('./routes/health')
let linkdropRouter = require('./routes/linkdrop')

app.use(cors())
app.use(bodyParser.json())
app.use('/', transactionRouter)
app.use('/', lockRouter)
app.use('/block', blockRouter)
app.use('/events', eventRouter)
app.use('/users', userRouter)
app.use('/purchase', purchaseRouter)
app.use('/price', priceRouter)
app.use('/api/key', metadataRouter)
app.use('/api/linkdrop', linkdropRouter)
app.use('/health', healthCheckRouter)

module.exports = app
