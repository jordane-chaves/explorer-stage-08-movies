import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { SpectatorWithAvatar } from '@/domain/enterprise/entities/value-objects/spectator-with-avatar'
import { Avatar as PrismaAvatar, User as PrismaUser } from '@prisma/client'

type PrismaSpectatorWithAvatar = PrismaUser & {
  avatar: PrismaAvatar | null
}

export class PrismaSpectatorWithAvatarMapper {
  static toDomain(raw: PrismaSpectatorWithAvatar): SpectatorWithAvatar {
    return SpectatorWithAvatar.create({
      spectatorId: new UniqueEntityID(raw.id),
      name: raw.name,
      email: raw.email,
      avatarId: raw.avatar ? new UniqueEntityID(raw.avatar.id) : null,
      avatar: raw.avatar ? raw.avatar.url : null,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    })
  }
}
