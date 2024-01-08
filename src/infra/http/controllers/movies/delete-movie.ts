import { FastifyRequest, FastifyReply } from 'fastify'
import { container } from 'tsyringe'
import { z } from 'zod'

import { DeleteMovieUseCase } from '@/domain/application/use-cases/delete-movie'
import { NotAllowedError } from '@/domain/application/use-cases/errors/not-allowed-error'

export async function deleteMovie(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const deleteMovieParamsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = deleteMovieParamsSchema.parse(request.params)

  const deleteMovieUseCase = container.resolve(DeleteMovieUseCase)

  const spectatorId = request.user.sub

  const result = await deleteMovieUseCase.execute({
    movieId: id,
    spectatorId,
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
