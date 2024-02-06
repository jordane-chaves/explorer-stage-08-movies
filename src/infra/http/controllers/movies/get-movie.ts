import { FastifyReply, FastifyRequest } from 'fastify'
import { container } from 'tsyringe'
import { z } from 'zod'

import { NotAllowedError } from '@/domain/application/use-cases/errors/not-allowed-error'
import { GetMovieUseCase } from '@/domain/application/use-cases/get-movie'

import { MovieDetailsPresenter } from '../../presenters/movie-details-presenter'

export async function getMovie(request: FastifyRequest, reply: FastifyReply) {
  const getMovieParamsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id: movieId } = getMovieParamsSchema.parse(request.params)
  const spectatorId = request.user.sub

  const getMovieUseCase = container.resolve(GetMovieUseCase)

  const result = await getMovieUseCase.execute({
    spectatorId,
    movieId,
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

  const { movie } = result.value

  return reply.status(200).send({
    movie: MovieDetailsPresenter.toHTTP(movie),
  })
}
