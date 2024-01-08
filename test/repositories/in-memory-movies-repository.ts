import { PaginationParams } from '@/core/repositories/pagination-params'
import { MoviesRepository } from '@/domain/application/repositories/movies-repository'
import { Movie } from '@/domain/enterprise/entities/movie'

import { InMemoryMovieTagsRepository } from './in-memory-movie-tags-repository'

export class InMemoryMoviesRepository implements MoviesRepository {
  public items: Movie[] = []

  constructor(private movieTagsRepository: InMemoryMovieTagsRepository) {}

  async findManyBySpectatorId(
    spectatorId: string,
    { page, perPage }: PaginationParams,
  ): Promise<Movie[]> {
    const movies = this.items
      .filter((item) => item.spectatorId.toString() === spectatorId)
      .slice((page - 1) * perPage, page * perPage)

    return movies
  }

  async findById(id: string): Promise<Movie | null> {
    const movie = this.items.find((item) => item.id.toString() === id)

    if (!movie) {
      return null
    }

    return movie
  }

  async create(movie: Movie): Promise<void> {
    this.items.push(movie)

    await this.movieTagsRepository.createMany(movie.tags.getItems())
  }

  async save(movie: Movie): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id.equals(movie.id))

    if (itemIndex >= 0) {
      this.items[itemIndex] = movie

      await this.movieTagsRepository.createMany(movie.tags.getNewItems())
      await this.movieTagsRepository.deleteMany(movie.tags.getRemovedItems())
    }
  }

  async delete(movie: Movie): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id.equals(movie.id))

    if (itemIndex >= 0) {
      this.items.splice(itemIndex, 1)

      await this.movieTagsRepository.deleteManyByMovieId(movie.id.toString())
    }
  }
}
