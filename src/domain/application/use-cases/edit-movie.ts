import { inject, injectable } from 'tsyringe'

import { Either, left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Movie } from '@/domain/enterprise/entities/movie'
import { MovieTag } from '@/domain/enterprise/entities/movie-tag'
import { MovieTagList } from '@/domain/enterprise/entities/movie-tag-list'
import { InvalidRatingRangeError } from '@/domain/enterprise/entities/value-objects/errors/invalid-rating-range-error'
import { Rating } from '@/domain/enterprise/entities/value-objects/rating'

import { MovieTagsRepository } from '../repositories/movie-tags-repository'
import { MoviesRepository } from '../repositories/movies-repository'
import { NotAllowedError } from './errors/not-allowed-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface EditMovieUseCaseRequest {
  spectatorId: string
  movieId: string
  title: string
  description?: string | null
  rating?: number | null
  watchedAt?: Date | null
  tagsIds: string[]
}

type EditMovieUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError | InvalidRatingRangeError,
  {
    movie: Movie
  }
>

@injectable()
export class EditMovieUseCase {
  constructor(
    @inject('MoviesRepository')
    private moviesRepository: MoviesRepository,
    @inject('MovieTagsRepository')
    private movieTagsRepository: MovieTagsRepository,
  ) {}

  async execute(
    request: EditMovieUseCaseRequest,
  ): Promise<EditMovieUseCaseResponse> {
    const {
      movieId,
      spectatorId,
      title,
      description,
      rating,
      watchedAt,
      tagsIds,
    } = request

    const movie = await this.moviesRepository.findById(movieId)

    if (!movie) {
      return left(new ResourceNotFoundError())
    }

    if (spectatorId !== movie.spectatorId.toString()) {
      return left(new NotAllowedError())
    }

    if (rating) {
      const newRating = Rating.create(rating)

      if (newRating.isLeft()) {
        return left(newRating.value)
      }

      movie.rating = newRating.value
    }

    const currentMovieTags =
      await this.movieTagsRepository.findManyByMovieId(movieId)

    const movieTagList = new MovieTagList(currentMovieTags)

    const movieTags = tagsIds.map((tagId) => {
      return MovieTag.create({
        tagId: new UniqueEntityID(tagId),
        movieId: movie.id,
      })
    })

    movieTagList.update(movieTags)

    movie.tags = movieTagList
    movie.title = title
    movie.description = description
    movie.watchedAt = watchedAt

    await this.moviesRepository.save(movie)

    return right({
      movie,
    })
  }
}
