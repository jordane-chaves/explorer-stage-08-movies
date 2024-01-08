import { inject, injectable } from 'tsyringe'

import { Either, right } from '@/core/either'
import { Movie } from '@/domain/enterprise/entities/movie'

import { MoviesRepository } from '../repositories/movies-repository'

interface FetchMoviesUseCaseRequest {
  spectatorId: string
  page: number
  perPage: number
}

type FetchMoviesUseCaseResponse = Either<
  null,
  {
    movies: Movie[]
  }
>

@injectable()
export class FetchMoviesUseCase {
  constructor(
    @inject('MoviesRepository')
    private moviesRepository: MoviesRepository,
  ) {}

  async execute(
    request: FetchMoviesUseCaseRequest,
  ): Promise<FetchMoviesUseCaseResponse> {
    const { spectatorId, page, perPage } = request

    const movies = await this.moviesRepository.findManyBySpectatorId(
      spectatorId,
      { page, perPage },
    )

    return right({
      movies,
    })
  }
}
