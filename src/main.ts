import 'reflect-metadata'

import { createServer } from 'http'
import Koa, { Context } from 'koa'
import cors from '@koa/cors'
import { ApolloServer } from 'apollo-server-koa'
import { buildSchema } from 'type-graphql'
import { MikroORM } from '@mikro-orm/core'

import { ENVIRONMENT, HOST, PORT } from './dependencies/config'

import { CustomContext } from './types/interfaces/CustomContext'

import { CandidateResolver } from './lib/resolvers/CandidateResolver'
import { InterviewResolver } from './lib/resolvers/InterviewResolver'
import { InternResolver } from './lib/resolvers/InternResolver'
import { ReviewResolver } from './lib/resolvers/ReviewResolver'

// import { AutoRegister } from './middlewares/AutoRegister'
import { AutoRegister } from '../src/middlewares/RegisterMiddleware'
import { ErrorInterceptor } from './middlewares/ErrorInterceptor'

import { jwt } from './middlewares/Authentication'
import { UserResolver } from './lib/resolvers/UserResolver'

async function main (): Promise<void> {
  console.log(`ENVIRONMENT: ${ENVIRONMENT}`)
  console.log('=== SETUP DATABASE ===')
  const connection = await MikroORM.init()

  console.log('=== BUILDING GQL SCHEMA ===')
  const schema = await buildSchema({
    resolvers: [
      CandidateResolver,
      InterviewResolver,
      InternResolver,
      ReviewResolver,
      UserResolver
    ],
    globalMiddlewares: [
      ErrorInterceptor
    ]
  })

  const apolloServer = new ApolloServer({
    schema,
    context ({ ctx }: { ctx: Context }): CustomContext {
      return {
        ctx,
        state: ctx.state,
        em: connection.em.fork()
      }
    }
  })

  const app = new Koa()
  if (ENVIRONMENT === 'production') {
    app.proxy = true
  }

  await apolloServer.start()
  app.use(cors())
    .use(jwt)
    .use(AutoRegister(connection.em.fork()))

  app.use(apolloServer.getMiddleware({ cors: false }))
  const httpServer = createServer(app.callback())

  httpServer.listen({ port: PORT }, () => {
    console.log(`http://${HOST}:${PORT}/graphql`)
  })
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
