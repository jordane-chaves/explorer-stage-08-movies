import { inject, injectable } from 'tsyringe'

import { SpectatorAvatarsRepository } from '@/domain/application/repositories/spectator-avatars-repository'
import { SpectatorAvatar } from '@/domain/enterprise/entities/spectator-avatar'

import { PrismaService } from '..'

@injectable()
export class PrismaSpectatorAvatarsRepository
  implements SpectatorAvatarsRepository
{
  constructor(
    @inject('PrismaService')
    private prisma: PrismaService,
  ) {}

  async create(avatar: SpectatorAvatar): Promise<void> {
    await this.prisma.avatar.update({
      where: {
        id: avatar.avatarId.toString(),
      },
      data: {
        userId: avatar.spectatorId.toString(),
      },
    })
  }
}
