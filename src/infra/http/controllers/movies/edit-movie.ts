import { FastifyReply, FastifyRequest } from 'fastify'
import { container } from 'tsyringe'
import { z } from 'zod'

import { EditMovieUseCase } from '@/domain/application/use-cases/edit-movie'
import { NotAllowedError } from '@/domain/application/use-cases/errors/not-allowed-error'

export async function editMovie(request: FastifyRequest, reply: FastifyReply) {
  const editMovieBodySchema = z.object({
    title: z.string(),
    description: z.string().optional(),
    rating: z.number().min(1).max(5).optional(),
    watchedAt: z.coerce.date().optional(),
    tagsIds: z.array(z.string().uuid()),
  })

  const editMovieParamsSchema = z.object({
    id: z.string().uuid(),
  })

  const { title, description, rating, tagsIds, watchedAt } =
    editMovieBodySchema.parse(request.body)

  const { id: movieId } = editMovieParamsSchema.parse(request.params)
  const spectatorId = request.user.sub

  const editMovieUseCase = container.resolve(EditMovieUseCase)

  const result = await editMovieUseCase.execute({
    spectatorId,
    movieId,
    title,
    description,
    rating,
    tagsIds,
    watchedAt,
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
