import { inject, injectable } from 'tsyringe'

import { Either, left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Movie } from '@/domain/enterprise/entities/movie'
import { MovieTag } from '@/domain/enterprise/entities/movie-tag'
import { MovieTagList } from '@/domain/enterprise/entities/movie-tag-list'
import { Tag } from '@/domain/enterprise/entities/tag'
import { InvalidRatingRangeError } from '@/domain/enterprise/entities/value-objects/errors/invalid-rating-range-error'
import { Rating } from '@/domain/enterprise/entities/value-objects/rating'

import { MoviesRepository } from '../repositories/movies-repository'
import { TagsRepository } from '../repositories/tags-repository'

interface CreateMovieUseCaseRequest {
  spectatorId: string
  title: string
  description?: string
  rating?: number
  watchedAt?: Date
  tagsNames: string[]
}

type CreateMovieUseCaseResponse = Either<
  InvalidRatingRangeError,
  {
    movie: Movie
  }
>

@injectable()
export class CreateMovieUseCase {
  constructor(
    @inject('MoviesRepository')
    private moviesRepository: MoviesRepository,
    @inject('TagsRepository')
    private tagsRepository: TagsRepository,
  ) {}

  async execute(
    request: CreateMovieUseCaseRequest,
  ): Promise<CreateMovieUseCaseResponse> {
    const { spectatorId, title, description, rating, watchedAt, tagsNames } =
      request

    const movie = Movie.create({
      spectatorId: new UniqueEntityID(spectatorId),
      title,
      description,
      watchedAt,
    })

    if (rating) {
      const newRating = Rating.create(rating)

      if (newRating.isLeft()) {
        return left(newRating.value)
      }

      movie.rating = newRating.value
    }

    const spectatorTags = await this.tagsRepository.findManyByAuthorIdAndNames(
      spectatorId,
      tagsNames,
    )

    const newTags = tagsNames
      .filter((tagName) => !spectatorTags.some((tag) => tag.name === tagName))
      .map((tag) =>
        Tag.create({
          authorId: new UniqueEntityID(spectatorId),
          name: tag,
        }),
      )

    await this.tagsRepository.createMany(newTags)

    spectatorTags.push(...newTags)

    const movieTags = spectatorTags.map((tag) =>
      MovieTag.create({
        tagId: tag.id,
        movieId: movie.id,
      }),
    )

    movie.tags = new MovieTagList(movieTags)

    await this.moviesRepository.create(movie)

    return right({
      movie,
    })
  }
}
