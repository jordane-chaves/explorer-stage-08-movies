import { FastifyReply, FastifyRequest } from 'fastify'
import { container } from 'tsyringe'
import { z } from 'zod'

import { NotAllowedError } from '@/domain/application/use-cases/errors/not-allowed-error'
import { GetTagUseCase } from '@/domain/application/use-cases/get-tag'

import { TagPresenter } from '../../presenters/tag-presenter'

export async function getTag(request: FastifyRequest, reply: FastifyReply) {
  const getTagParamsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id: tagId } = getTagParamsSchema.parse(request.params)
  const spectatorId = request.user.sub

  const getTagUseCase = container.resolve(GetTagUseCase)

  const result = await getTagUseCase.execute({
    spectatorId,
    tagId,
  })

  if (result.isLeft()) {
    const error = result.value

    switch (error.constructor) {
      case NotAllowedError:
        return reply.status(405).send({
          message: error.message,
          statusCode: 405,
        })
      default:
        return reply.status(400).send({
          message: error.message,
          statusCode: 400,
        })
    }
  }

  const { tag } = result.value

  return reply.status(200).send({
    tag: TagPresenter.toHTTP(tag),
  })
}
