import { FastifyReply, FastifyRequest } from 'fastify'
import { container } from 'tsyringe'
import { z } from 'zod'

import { CreateTagUseCase } from '@/domain/application/use-cases/create-tag'

import { TagPresenter } from '../../presenters/tag-presenter'

export async function createTag(request: FastifyRequest, reply: FastifyReply) {
  const createTagBodySchema = z.object({
    name: z.string(),
  })

  const { name } = createTagBodySchema.parse(request.body)

  const createTagUseCase = container.resolve(CreateTagUseCase)

  const spectatorId = request.user.sub

  const result = await createTagUseCase.execute({
    spectatorId,
    name,
  })

  if (result.isLeft()) {
    return reply.status(400).send({
      message: 'Bad Request',
      statusCode: 400,
    })
  }

  const { tag } = result.value

  return reply.status(201).send({
    tag: TagPresenter.toHTTP(tag),
  })
}
