import { inject, injectable } from 'tsyringe'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Spectator,
  SpectatorProps,
} from '@/domain/enterprise/entities/spectator'
import { PrismaService } from '@/infra/database/prisma'
import { PrismaSpectatorMapper } from '@/infra/database/prisma/mappers/prisma-spectator-mapper'
import { faker } from '@faker-js/faker'

export function makeSpectator(
  override: Partial<SpectatorProps> = {},
  id?: UniqueEntityID,
): Spectator {
  return Spectator.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      passwordHash: faker.internet.password(),
      ...override,
    },
    id,
  )
}

@injectable()
export class SpectatorFactory {
  constructor(
    @inject('PrismaService')
    private prisma: PrismaService,
  ) {}

  async makePrismaSpectator(
    data: Partial<SpectatorProps> = {},
  ): Promise<Spectator> {
    const spectator = makeSpectator(data)

    await this.prisma.user.create({
      data: PrismaSpectatorMapper.toPrisma(spectator),
    })

    return spectator
  }
}
