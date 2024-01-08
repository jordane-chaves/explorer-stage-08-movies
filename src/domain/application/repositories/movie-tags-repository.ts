import { MovieTag } from '@/domain/enterprise/entities/movie-tag'

export interface MovieTagsRepository {
  findManyByMovieId(movieId: string): Promise<MovieTag[]>
  createMany(tags: MovieTag[]): Promise<void>
  deleteMany(tags: MovieTag[]): Promise<void>
  deleteManyByMovieId(movieId: string): Promise<void>
}
