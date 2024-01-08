import { inject, injectable } from 'tsyringe'

import { MovieTagsRepository } from '@/domain/application/repositories/movie-tags-repository'
import { MovieTag } from '@/domain/enterprise/entities/movie-tag'

import { PrismaService } from '..'

import { PrismaMovieTagMapper } from '../mappers/prisma-movie-tag-mapper'

@injectable()
export class PrismaMovieTagsRepository implements MovieTagsRepository {
  constructor(
    @inject('PrismaService')
    private prisma: PrismaService,
  ) {}

  async findManyByMovieId(movieId: string): Promise<MovieTag[]> {
    const movies = await this.prisma.movieTag.findMany({
      where: {
        movieId,
      },
    })

    return movies.map(PrismaMovieTagMapper.toDomain)
  }

  async createMany(tags: MovieTag[]): Promise<void> {
    const data = tags.map(PrismaMovieTagMapper.toPrisma)

    await this.prisma.movieTag.createMany({
      data,
    })
  }

  async deleteMany(tags: MovieTag[]): Promise<void> {
    const movieTagIds = tags.map((tag) => tag.id.toString())

    await this.prisma.movieTag.deleteMany({
      where: {
        id: {
          in: movieTagIds,
        },
      },
    })
  }

  async deleteManyByMovieId(movieId: string): Promise<void> {
    await this.prisma.movieTag.deleteMany({
      where: {
        movieId,
      },
    })
  }
}
