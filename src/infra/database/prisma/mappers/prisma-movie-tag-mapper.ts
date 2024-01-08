import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { MovieTag } from '@/domain/enterprise/entities/movie-tag'
import { Prisma, MovieTag as PrismaMovieTag } from '@prisma/client'

export class PrismaMovieTagMapper {
  static toDomain(raw: PrismaMovieTag): MovieTag {
    return MovieTag.create(
      {
        movieId: new UniqueEntityID(raw.movieId),
        tagId: new UniqueEntityID(raw.tagId),
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(tag: MovieTag): Prisma.MovieTagUncheckedCreateInput {
    return {
      id: tag.id.toString(),
      movieId: tag.movieId.toString(),
      tagId: tag.tagId.toString(),
    }
  }
}
