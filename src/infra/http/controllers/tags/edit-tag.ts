import { FastifyReply, FastifyRequest } from 'fastify'
import { container } from 'tsyringe'
import { z } from 'zod'

import { EditTagUseCase } from '@/domain/application/use-cases/edit-tag'
import { NotAllowedError } from '@/domain/application/use-cases/errors/not-allowed-error'

export async function editTag(request: FastifyRequest, reply: FastifyReply) {
  const editTagBodySchema = z.object({
    name: z.string(),
  })

  const editTagParamsSchema = z.object({
    id: z.string().uuid(),
  })

  const { name } = editTagBodySchema.parse(request.body)

  const { id: tagId } = editTagParamsSchema.parse(request.params)
  const spectatorId = request.user.sub

  const editTagUseCase = container.resolve(EditTagUseCase)

  const result = await editTagUseCase.execute({
    spectatorId,
    tagId,
    name,
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

  return reply.status(204).send()
}
