import { inject, injectable } from 'tsyringe'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Avatar, AvatarProps } from '@/domain/enterprise/entities/avatar'
import { PrismaService } from '@/infra/database/prisma'
import { PrismaAvatarMapper } from '@/infra/database/prisma/mappers/prisma-avatar-mapper'
import { faker } from '@faker-js/faker'

export function makeAvatar(
  override: Partial<AvatarProps> = {},
  id?: UniqueEntityID,
): Avatar {
  return Avatar.create(
    {
      title: faker.image.avatar(),
      url: faker.image.avatar(),
      ...override,
    },
    id,
  )
}

@injectable()
export class AvatarFactory {
  constructor(
    @inject('PrismaService')
    private prisma: PrismaService,
  ) {}

  async makePrismaAvatar(data: Partial<AvatarProps> = {}): Promise<Avatar> {
    const avatar = makeAvatar(data)

    await this.prisma.avatar.create({
      data: PrismaAvatarMapper.toPrisma(avatar),
    })

    return avatar
  }
}
