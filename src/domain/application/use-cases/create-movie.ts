import { inject, injectable } from 'tsyringe'

import { Either, left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Movie } from '@/domain/enterprise/entities/movie'
import { MovieTag } from '@/domain/enterprise/entities/movie-tag'
import { MovieTagList } from '@/domain/enterprise/entities/movie-tag-list'
import { InvalidRatingRangeError } from '@/domain/enterprise/entities/value-objects/errors/invalid-rating-range-error'
import { Rating } from '@/domain/enterprise/entities/value-objects/rating'

import { MoviesRepository } from '../repositories/movies-repository'

interface CreateMovieUseCaseRequest {
  spectatorId: string
  title: string
  description?: string
  rating?: number
  watchedAt?: Date
  tagsIds: string[]
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
  ) {}

  async execute(
    request: CreateMovieUseCaseRequest,
  ): Promise<CreateMovieUseCaseResponse> {
    const { spectatorId, title, description, rating, watchedAt, tagsIds } =
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

    const movieTags = tagsIds.map((tagId) => {
      return MovieTag.create({
        tagId: new UniqueEntityID(tagId),
        movieId: movie.id,
      })
    })

    movie.tags = new MovieTagList(movieTags)

    await this.moviesRepository.create(movie)

    return right({
      movie,
    })
  }
}
