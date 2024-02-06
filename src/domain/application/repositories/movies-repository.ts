import { PaginationParams } from '@/core/repositories/pagination-params'
import { Movie } from '@/domain/enterprise/entities/movie'
import { MovieDetails } from '@/domain/enterprise/entities/value-objects/movie-details'

export interface MoviesRepository {
  findManyBySpectatorId(
    spectatorId: string,
    params: PaginationParams,
  ): Promise<Movie[]>
  findDetailsById(id: string): Promise<MovieDetails | null>
  findById(id: string): Promise<Movie | null>
  create(movie: Movie): Promise<void>
  save(movie: Movie): Promise<void>
  delete(movie: Movie): Promise<void>
}
