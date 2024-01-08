import { inject, injectable } from 'tsyringe'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { MovieTag, MovieTagProps } from '@/domain/enterprise/entities/movie-tag'
import { PrismaService } from '@/infra/database/prisma'
import { PrismaMovieTagMapper } from '@/infra/database/prisma/mappers/prisma-movie-tag-mapper'

export function makeMovieTag(
  override: Partial<MovieTagProps> = {},
  id?: UniqueEntityID,
): MovieTag {
  return MovieTag.create(
    {
      movieId: new UniqueEntityID(),
      tagId: new UniqueEntityID(),
      ...override,
    },
    id,
  )
}

@injectable()
export class MovieTagFactory {
  constructor(
    @inject('PrismaService')
    private prisma: PrismaService,
  ) {}

  async makePrismaMovieTag(data: Partial<MovieTagProps> = {}) {
    const movieTag = makeMovieTag(data)

    await this.prisma.movieTag.create({
      data: PrismaMovieTagMapper.toPrisma(movieTag),
    })

    return movieTag
  }
}
