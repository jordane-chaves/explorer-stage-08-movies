import { FastifyReply, FastifyRequest } from 'fastify'
import { container } from 'tsyringe'
import { z } from 'zod'

import { EditSpectatorUseCase } from '@/domain/application/use-cases/edit-spectator'
import { NotAllowedError } from '@/domain/application/use-cases/errors/not-allowed-error'

export async function editSpectator(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const registerBodySchema = z.object({
    avatarId: z.string().uuid().optional(),
    name: z.string(),
    email: z.string().email(),
    password: z.string().optional(),
    oldPassword: z.string().optional(),
  })

  const { avatarId, name, email, password, oldPassword } =
    registerBodySchema.parse(request.body)

  const registerSpectatorUseCase = container.resolve(EditSpectatorUseCase)

  const spectatorId = request.user.sub

  const result = await registerSpectatorUseCase.execute({
    spectatorId,
    avatarId,
    name,
    email,
    password,
    oldPassword,
  })

  if (result.isLeft()) {
    const error = result.value

    switch (error.constructor) {
      case NotAllowedError:
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

  return reply.status(204).send()
}
