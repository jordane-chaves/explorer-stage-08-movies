import { inject, injectable } from 'tsyringe'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  SpectatorAvatar,
  SpectatorAvatarProps,
} from '@/domain/enterprise/entities/spectator-avatar'
import { PrismaService } from '@/infra/database/prisma'

export function makeSpectatorAvatar(
  override: Partial<SpectatorAvatarProps> = {},
  id?: UniqueEntityID,
): SpectatorAvatar {
  return SpectatorAvatar.create(
    {
      avatarId: new UniqueEntityID(),
      spectatorId: new UniqueEntityID(),
      ...override,
    },
    id,
  )
}

@injectable()
export class SpectatorAvatarFactory {
  constructor(
    @inject('PrismaService')
    private prisma: PrismaService,
  ) {}

  async makePrismaSpectatorAvatar(
    data: Partial<SpectatorAvatarProps> = {},
  ): Promise<SpectatorAvatar> {
    const spectatorAvatar = makeSpectatorAvatar(data)

    await this.prisma.avatar.update({
      where: {
        id: spectatorAvatar.avatarId.toString(),
      },
      data: {
        userId: spectatorAvatar.spectatorId.toString(),
      },
    })

    return spectatorAvatar
  }
}
