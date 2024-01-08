import { inject, injectable } from 'tsyringe'

import { Either, left, right } from '@/core/either'
import { Movie } from '@/domain/enterprise/entities/movie'

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
    movie: Movie
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

    const movie = await this.moviesRepository.findById(movieId)

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
