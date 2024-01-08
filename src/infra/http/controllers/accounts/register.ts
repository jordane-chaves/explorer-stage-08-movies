import { FastifyReply, FastifyRequest } from 'fastify'
import { container } from 'tsyringe'
import { z } from 'zod'

import { SpectatorAlreadyExistsError } from '@/domain/application/use-cases/errors/spectator-already-exists-error'
import { RegisterSpectatorUseCase } from '@/domain/application/use-cases/register-spectator'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
  })

  const { name, email, password } = registerBodySchema.parse(request.body)

  const registerSpectatorUseCase = container.resolve(RegisterSpectatorUseCase)

  const result = await registerSpectatorUseCase.execute({
    name,
    email,
    password,
  })

  if (result.isLeft()) {
    const error = result.value

    switch (error.constructor) {
      case SpectatorAlreadyExistsError:
        return reply.status(409).send({
          message: error.message,
          statusCode: 409,
        })
      default:
        return reply.status(400).send({
          message: error.message,
          statusCode: 400,
        })
    }
  }

  return reply.status(201).send()
}
