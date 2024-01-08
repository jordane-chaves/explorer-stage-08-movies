import { FastifyReply, FastifyRequest } from 'fastify'
import { container } from 'tsyringe'
import { z } from 'zod'

import { CreateMovieUseCase } from '@/domain/application/use-cases/create-movie'
import { InvalidRatingRangeError } from '@/domain/enterprise/entities/value-objects/errors/invalid-rating-range-error'

import { MoviePresenter } from '../../presenters/movie-presenter'

export async function createMovie(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createMovieBodySchema = z.object({
    title: z.string(),
    description: z.string().optional(),
    rating: z.number().min(1).max(5).optional(),
    watchedAt: z.coerce.date().optional(),
    tagsIds: z.array(z.string().uuid()),
  })

  const { title, description, rating, watchedAt, tagsIds } =
    createMovieBodySchema.parse(request.body)

  const createMovieUseCase = container.resolve(CreateMovieUseCase)

  const spectatorId = request.user.sub

  const result = await createMovieUseCase.execute({
    spectatorId,
    title,
    description,
    rating,
    watchedAt,
    tagsIds,
  })

  if (result.isLeft()) {
    const error = result.value

    switch (error.constructor) {
      case InvalidRatingRangeError:
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

  const { movie } = result.value

  return reply.status(201).send({
    movie: MoviePresenter.toHTTP(movie),
  })
}
