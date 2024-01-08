import { inject, injectable } from 'tsyringe'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Tag, TagProps } from '@/domain/enterprise/entities/tag'
import { PrismaService } from '@/infra/database/prisma'
import { PrismaTagMapper } from '@/infra/database/prisma/mappers/prisma-tag-mapper'
import { faker } from '@faker-js/faker'

export function makeTag(
  override: Partial<TagProps> = {},
  id?: UniqueEntityID,
): Tag {
  return Tag.create(
    {
      authorId: new UniqueEntityID(),
      name: faker.lorem.words(),
      ...override,
    },
    id,
  )
}

@injectable()
export class TagFactory {
  constructor(
    @inject('PrismaService')
    private prisma: PrismaService,
  ) {}

  async makePrismaTag(data: Partial<TagProps> = {}) {
    const tag = makeTag(data)

    await this.prisma.tag.create({
      data: PrismaTagMapper.toPrisma(tag),
    })

    return tag
  }
}
