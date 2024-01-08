import { inject, injectable } from 'tsyringe'

import { Either, left, right } from '@/core/either'

import { MoviesRepository } from '../repositories/movies-repository'
import { NotAllowedError } from './errors/not-allowed-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface DeleteMovieUseCaseRequest {
  spectatorId: string
  movieId: string
}

type DeleteMovieUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>

@injectable()
export class DeleteMovieUseCase {
  constructor(
    @inject('MoviesRepository')
    private moviesRepository: MoviesRepository,
  ) {}

  async execute(
    request: DeleteMovieUseCaseRequest,
  ): Promise<DeleteMovieUseCaseResponse> {
    const { movieId, spectatorId } = request

    const movie = await this.moviesRepository.findById(movieId)

    if (!movie) {
      return left(new ResourceNotFoundError())
    }

    if (spectatorId !== movie.spectatorId.toString()) {
      return left(new NotAllowedError())
    }

    await this.moviesRepository.delete(movie)

    return right(null)
  }
}
