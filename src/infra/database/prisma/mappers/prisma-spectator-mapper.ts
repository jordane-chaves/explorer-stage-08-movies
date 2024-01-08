import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Spectator } from '@/domain/enterprise/entities/spectator'
import { Prisma, User as PrismaUser } from '@prisma/client'

export class PrismaSpectatorMapper {
  static toDomain(raw: PrismaUser): Spectator {
    return Spectator.create(
      {
        name: raw.name,
        email: raw.email,
        passwordHash: raw.passwordHash,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(spectator: Spectator): Prisma.UserUncheckedCreateInput {
    return {
      id: spectator.id.toString(),
      name: spectator.name,
      email: spectator.email,
      passwordHash: spectator.passwordHash,
      createdAt: spectator.createdAt,
      updatedAt: spectator.updatedAt,
    }
  }
}
