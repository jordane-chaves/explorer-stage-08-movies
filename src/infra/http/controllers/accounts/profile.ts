import { FastifyReply, FastifyRequest } from 'fastify'
import { container } from 'tsyringe'

import { GetSpectatorUseCase } from '@/domain/application/use-cases/get-spectator'

import { SpectatorWithAvatarPresenter } from '../../presenters/spectator-with-avatar-presenter'

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  const getSpectator = container.resolve(GetSpectatorUseCase)

  const spectatorId = request.user.sub

  const result = await getSpectator.execute({
    spectatorId,
  })

  if (result.isLeft()) {
    const error = result.value

    return reply.status(400).send({
      message: error.message,
      statusCode: 400,
    })
  }

  const { spectator } = result.value

  return reply.status(200).send({
    user: SpectatorWithAvatarPresenter.toHTTP(spectator),
  })
}
