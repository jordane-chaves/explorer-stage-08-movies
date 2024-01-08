import { FastifyReply, FastifyRequest } from 'fastify'
import { container } from 'tsyringe'
import { z } from 'zod'

import { FetchMoviesUseCase } from '@/domain/application/use-cases/fetch-movies'

import { MoviePresenter } from '../../presenters/movie-presenter'

export async function fetchMovies(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const fetchMoviesQuerySchema = z.object({
    page: z.coerce.number().min(1).optional().default(1),
    perPage: z.coerce.number().min(1).optional().default(20),
  })

  const { page, perPage } = fetchMoviesQuerySchema.parse(request.query)

  const spectatorId = request.user.sub

  const fetchMoviesUseCase = container.resolve(FetchMoviesUseCase)

  const result = await fetchMoviesUseCase.execute({
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

  const { movies } = result.value

  return reply.status(200).send({
    movies: movies.map(MoviePresenter.toHTTP),
  })
}
