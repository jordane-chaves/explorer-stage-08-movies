import 'reflect-metadata'
import fastify from 'fastify'
import { ZodError } from 'zod'

import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastifyMultipart from '@fastify/multipart'

import '@/infra/container'
import { env } from './env'
import { accountRoutes } from './http/controllers/accounts/routes'
import { movieRoutes } from './http/controllers/movies/routes'
import { tagRoutes } from './http/controllers/tags/routes'

export const app = fastify()

app.register(fastifyCors)

app.register(fastifyJwt, {
  secret: {
    private: Buffer.from(env.JWT_PRIVATE_KEY, 'base64'),
    public: Buffer.from(env.JWT_PUBLIC_KEY, 'base64'),
  },
  sign: {
    algorithm: 'RS256',
  },
})

app.register(fastifyMultipart)

app.register(accountRoutes)
app.register(movieRoutes)
app.register(tagRoutes)

app.setErrorHandler(async (error, _, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation error',
      issues: error.format(),
      statusCode: 400,
    })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO: Here we should log to an external tool like DataDog/Newrelic/Sentry
  }

  return reply.status(500).send({
    message: 'Internal server error.',
    statusCode: 500,
  })
})
