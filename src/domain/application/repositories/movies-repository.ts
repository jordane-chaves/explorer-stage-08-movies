import { PaginationParams } from '@/core/repositories/pagination-params'
import { Movie } from '@/domain/enterprise/entities/movie'

export interface MoviesRepository {
  findManyBySpectatorId(
    spectatorId: string,
    params: PaginationParams,
  ): Promise<Movie[]>
  findById(id: string): Promise<Movie | null>
  create(movie: Movie): Promise<void>
  save(movie: Movie): Promise<void>
  delete(movie: Movie): Promise<void>
}
