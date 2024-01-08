import { MovieTagsRepository } from '@/domain/application/repositories/movie-tags-repository'
import { MovieTag } from '@/domain/enterprise/entities/movie-tag'

export class InMemoryMovieTagsRepository implements MovieTagsRepository {
  public items: MovieTag[] = []

  async findManyByMovieId(movieId: string): Promise<MovieTag[]> {
    const movieTags = this.items.filter(
      (item) => item.movieId.toString() === movieId,
    )

    return movieTags
  }

  async createMany(tags: MovieTag[]): Promise<void> {
    this.items.push(...tags)
  }

  async deleteMany(tags: MovieTag[]): Promise<void> {
    const movieTags = this.items.filter(
      (item) => !tags.some((tag) => tag.equals(item)),
    )

    this.items = movieTags
  }

  async deleteManyByMovieId(movieId: string): Promise<void> {
    const movieTags = this.items.filter(
      (item) => item.movieId.toString() !== movieId,
    )

    this.items = movieTags
  }
}
