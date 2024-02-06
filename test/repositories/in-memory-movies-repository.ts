import { PaginationParams } from '@/core/repositories/pagination-params'
import { MoviesRepository } from '@/domain/application/repositories/movies-repository'
import { Movie } from '@/domain/enterprise/entities/movie'
import { MovieDetails } from '@/domain/enterprise/entities/value-objects/movie-details'

import { InMemoryMovieTagsRepository } from './in-memory-movie-tags-repository'
import { InMemorySpectatorsRepository } from './in-memory-spectators-repository'
import { InMemoryTagsRepository } from './in-memory-tags-repository'

export class InMemoryMoviesRepository implements MoviesRepository {
  public items: Movie[] = []

  constructor(
    private movieTagsRepository: InMemoryMovieTagsRepository,
    private spectatorsRepository: InMemorySpectatorsRepository,
    private tagsRepository: InMemoryTagsRepository,
  ) {}

  async findManyBySpectatorId(
    spectatorId: string,
    { page, perPage }: PaginationParams,
  ): Promise<Movie[]> {
    const movies = this.items
      .filter((item) => item.spectatorId.toString() === spectatorId)
      .slice((page - 1) * perPage, page * perPage)

    return movies
  }

  async findDetailsById(id: string): Promise<MovieDetails | null> {
    const movie = this.items.find((item) => item.id.toString() === id)

    if (!movie) {
      return null
    }

    const spectator = await this.spectatorsRepository.findByIdWithAvatar(
      movie.spectatorId.toString(),
    )

    if (!spectator) {
      throw new Error(
        `Spectator with ID ${movie.spectatorId.toString()} does not exist.`,
      )
    }

    const movieTags = this.movieTagsRepository.items.filter((movieTag) => {
      return movieTag.movieId.equals(movie.id)
    })

    const tags = movieTags.map((movieTag) => {
      const tag = this.tagsRepository.items.find((tag) => {
        return tag.id.equals(movieTag.tagId)
      })

      if (!tag) {
        throw new Error(
          `Tag with ID ${movieTag.tagId.toString()} does not exist.`,
        )
      }

      return tag
    })

    return MovieDetails.create({
      movieId: movie.id,
      spectatorId: movie.spectatorId,
      spectator,
      title: movie.title,
      description: movie.description,
      rating: movie.rating,
      tags,
      watchedAt: movie.watchedAt,
      createdAt: movie.createdAt,
      updatedAt: movie.updatedAt,
    })
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
