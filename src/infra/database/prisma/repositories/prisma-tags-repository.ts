import { inject, injectable } from 'tsyringe'

import { PaginationParams } from '@/core/repositories/pagination-params'
import { TagsRepository } from '@/domain/application/repositories/tags-repository'
import { Tag } from '@/domain/enterprise/entities/tag'

import { PrismaService } from '..'

import { PrismaTagMapper } from '../mappers/prisma-tag-mapper'

@injectable()
export class PrismaTagsRepository implements TagsRepository {
  constructor(
    @inject('PrismaService')
    private prisma: PrismaService,
  ) {}

  async findManyByAuthorIdAndNames(
    authorId: string,
    names: string[],
  ): Promise<Tag[]> {
    const tags = await this.prisma.tag.findMany({
      where: {
        authorId,
        name: {
          in: names,
        },
      },
    })

    return tags.map(PrismaTagMapper.toDomain)
  }

  async findManyByAuthorId(
    authorId: string,
    { page, perPage }: PaginationParams,
  ): Promise<Tag[]> {
    const tags = await this.prisma.tag.findMany({
      where: {
        authorId,
      },
      take: perPage,
      skip: (page - 1) * perPage,
    })

    return tags.map(PrismaTagMapper.toDomain)
  }

  async findByAuthorIdAndName(
    authorId: string,
    name: string,
  ): Promise<Tag | null> {
    const tag = await this.prisma.tag.findFirst({
      where: {
        authorId,
        name,
      },
    })

    if (!tag) {
      return null
    }

    return PrismaTagMapper.toDomain(tag)
  }

  async findById(id: string): Promise<Tag | null> {
    const tag = await this.prisma.tag.findUnique({
      where: {
        id,
      },
    })

    if (!tag) {
      return null
    }

    return PrismaTagMapper.toDomain(tag)
  }

  async createMany(tags: Tag[]): Promise<void> {
    const data = tags.map(PrismaTagMapper.toPrisma)

    await this.prisma.tag.createMany({
      data,
      skipDuplicates: true,
    })
  }

  async create(tag: Tag): Promise<void> {
    const data = PrismaTagMapper.toPrisma(tag)

    await this.prisma.tag.create({
      data,
    })
  }

  async save(tag: Tag): Promise<void> {
    const data = PrismaTagMapper.toPrisma(tag)

    await this.prisma.tag.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async delete(tag: Tag): Promise<void> {
    await this.prisma.tag.delete({
      where: {
        id: tag.id.toString(),
      },
    })
  }
}
