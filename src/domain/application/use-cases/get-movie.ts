import { inject, injectable } from 'tsyringe'

import { Either, left, right } from '@/core/either'
import { MovieDetails } from '@/domain/enterprise/entities/value-objects/movie-details'

import { MoviesRepository } from '../repositories/movies-repository'
import { NotAllowedError } from './errors/not-allowed-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface GetMovieUseCaseRequest {
  spectatorId: string
  movieId: string
}

type GetMovieUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    movie: MovieDetails
  }
>

@injectable()
export class GetMovieUseCase {
  constructor(
    @inject('MoviesRepository')
    private moviesRepository: MoviesRepository,
  ) {}

  async execute(
    request: GetMovieUseCaseRequest,
  ): Promise<GetMovieUseCaseResponse> {
    const { movieId, spectatorId } = request

    const movie = await this.moviesRepository.findDetailsById(movieId)

    if (!movie) {
      return left(new ResourceNotFoundError())
    }

    if (spectatorId !== movie.spectatorId.toString()) {
      return left(new NotAllowedError())
    }

    return right({
      movie,
    })
  }
}
