import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Movie } from '@/domain/enterprise/entities/movie'
import { Rating } from '@/domain/enterprise/entities/value-objects/rating'
import { Prisma, Movie as PrismaMovie } from '@prisma/client'

export class PrismaMovieMapper {
  static toDomain(raw: PrismaMovie): Movie {
    let rating = null

    if (raw.rating) {
      const ratingResult = Rating.create(raw.rating)

      if (ratingResult.isLeft()) {
        throw new Error('Invalid rating')
      }

      rating = ratingResult.value
    }

    return Movie.create(
      {
        spectatorId: new UniqueEntityID(raw.spectatorId),
        title: raw.title,
        description: raw.description,
        rating,
        watchedAt: raw.watchedAt,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(movie: Movie): Prisma.MovieUncheckedCreateInput {
    return {
      id: movie.id.toString(),
      spectatorId: movie.spectatorId.toString(),
      title: movie.title,
      description: movie.description,
      rating: movie.rating?.value,
      watchedAt: movie.watchedAt,
      createdAt: movie.createdAt,
      updatedAt: movie.updatedAt,
    }
  }
}
