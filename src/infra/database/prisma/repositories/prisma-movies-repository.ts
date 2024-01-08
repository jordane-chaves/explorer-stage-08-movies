import { inject, injectable } from 'tsyringe'

import { PaginationParams } from '@/core/repositories/pagination-params'
import { MovieTagsRepository } from '@/domain/application/repositories/movie-tags-repository'
import { MoviesRepository } from '@/domain/application/repositories/movies-repository'
import { Movie } from '@/domain/enterprise/entities/movie'

import { PrismaService } from '..'

import { PrismaMovieMapper } from '../mappers/prisma-movie-mapper'

@injectable()
export class PrismaMoviesRepository implements MoviesRepository {
  constructor(
    @inject('PrismaService')
    private prisma: PrismaService,
    @inject('MovieTagsRepository')
    private movieTagsRepository: MovieTagsRepository,
  ) {}

  async findManyBySpectatorId(
    spectatorId: string,
    { page, perPage }: PaginationParams,
  ): Promise<Movie[]> {
    const movies = await this.prisma.movie.findMany({
      where: {
        spectatorId,
      },
      take: perPage,
      skip: (page - 1) * perPage,
    })

    return movies.map(PrismaMovieMapper.toDomain)
  }

  async findById(id: string): Promise<Movie | null> {
    const movie = await this.prisma.movie.findUnique({
      where: {
        id,
      },
    })

    if (!movie) {
      return null
    }

    return PrismaMovieMapper.toDomain(movie)
  }

  async create(movie: Movie): Promise<void> {
    const data = PrismaMovieMapper.toPrisma(movie)

    await this.prisma.movie.create({
      data,
    })

    await this.movieTagsRepository.createMany(movie.tags.getItems())
  }

  async save(movie: Movie): Promise<void> {
    const data = PrismaMovieMapper.toPrisma(movie)

    await this.prisma.movie.update({
      where: {
        id: data.id,
      },
      data,
    })

    await this.movieTagsRepository.createMany(movie.tags.getNewItems())
    await this.movieTagsRepository.deleteMany(movie.tags.getRemovedItems())
  }

  async delete(movie: Movie): Promise<void> {
    await this.prisma.movie.delete({
      where: {
        id: movie.id.toString(),
      },
    })
  }
}
