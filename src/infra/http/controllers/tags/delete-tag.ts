import { FastifyRequest, FastifyReply } from 'fastify'
import { container } from 'tsyringe'
import { z } from 'zod'

import { DeleteTagUseCase } from '@/domain/application/use-cases/delete-tag'
import { NotAllowedError } from '@/domain/application/use-cases/errors/not-allowed-error'

export async function deleteTag(request: FastifyRequest, reply: FastifyReply) {
  const deleteTagParamsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id: tagId } = deleteTagParamsSchema.parse(request.params)
  const deleteTagUseCase = container.resolve(DeleteTagUseCase)

  const spectatorId = request.user.sub

  const result = await deleteTagUseCase.execute({
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

  return reply.status(204).send()
}
