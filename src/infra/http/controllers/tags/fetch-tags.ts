import { FastifyReply, FastifyRequest } from 'fastify'
import { container } from 'tsyringe'
import { z } from 'zod'

import { FetchTagsUseCase } from '@/domain/application/use-cases/fetch-tags'

import { TagPresenter } from '../../presenters/tag-presenter'

export async function fetchTags(request: FastifyRequest, reply: FastifyReply) {
  const fetchTagsQuerySchema = z.object({
    page: z.coerce.number().min(1).optional().default(1),
    perPage: z.coerce.number().min(1).optional().default(20),
  })

  const { page, perPage } = fetchTagsQuerySchema.parse(request.query)

  const spectatorId = request.user.sub

  const fetchTagsUseCase = container.resolve(FetchTagsUseCase)

  const result = await fetchTagsUseCase.execute({
    spectatorId,
    page,
    perPage,
  })

  if (result.isLeft()) {
    return reply.status(400).send({
      message: 'Bad Request',
      statusCode: 400,
    })
  }

  const { tags } = result.value

  return reply.status(200).send({
    tags: tags.map(TagPresenter.toHTTP),
  })
}
