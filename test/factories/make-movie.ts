import { inject, injectable } from 'tsyringe'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Movie, MovieProps } from '@/domain/enterprise/entities/movie'
import { PrismaService } from '@/infra/database/prisma'
import { PrismaMovieMapper } from '@/infra/database/prisma/mappers/prisma-movie-mapper'
import { faker } from '@faker-js/faker'

export function makeMovie(
  override: Partial<MovieProps> = {},
  id?: UniqueEntityID,
): Movie {
  return Movie.create(
    {
      spectatorId: new UniqueEntityID(),
      title: faker.lorem.words(),
      ...override,
    },
    id,
  )
}

@injectable()
export class MovieFactory {
  constructor(
    @inject('PrismaService')
    private prisma: PrismaService,
  ) {}

  async makePrismaMovie(data: Partial<MovieProps> = {}) {
    const movie = makeMovie(data)

    await this.prisma.movie.create({
      data: PrismaMovieMapper.toPrisma(movie),
    })

    return movie
  }
}
