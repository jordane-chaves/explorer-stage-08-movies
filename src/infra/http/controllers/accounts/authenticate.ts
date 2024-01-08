import { FastifyReply, FastifyRequest } from 'fastify'
import { container } from 'tsyringe'
import { z } from 'zod'

import { AuthenticateSpectatorUseCase } from '@/domain/application/use-cases/authenticate-spectator'
import { WrongCredentialsError } from '@/domain/application/use-cases/errors/wrong-credentials-error'

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string(),
  })

  const { email, password } = authenticateBodySchema.parse(request.body)

  const authenticateSpectatorUseCase = container.resolve(
    AuthenticateSpectatorUseCase,
  )

  const result = await authenticateSpectatorUseCase.execute({
    email,
    password,
  })

  if (result.isLeft()) {
    const error = result.value

    switch (error.constructor) {
      case WrongCredentialsError:
        return reply.status(401).send({
          message: error.message,
          statusCode: 401,
        })
      default:
        return reply.status(400).send({
          message: error.message,
          statusCode: 400,
        })
    }
  }

  const { accessToken } = result.value

  return reply.status(201).send({
    access_token: accessToken,
  })
}
