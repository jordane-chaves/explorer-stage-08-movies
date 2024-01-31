import { inject, injectable } from 'tsyringe'

import { SpectatorAvatarsRepository } from '@/domain/application/repositories/spectator-avatars-repository'
import { SpectatorsRepository } from '@/domain/application/repositories/spectators-repository'
import { Spectator } from '@/domain/enterprise/entities/spectator'

import { PrismaService } from '..'

import { SpectatorWithAvatar } from '@/domain/enterprise/entities/value-objects/spectator-with-avatar'

import { PrismaSpectatorMapper } from '../mappers/prisma-spectator-mapper'
import { PrismaSpectatorWithAvatarMapper } from '../mappers/prisma-spectator-with-avatar-mapper'

@injectable()
export class PrismaSpectatorsRepository implements SpectatorsRepository {
  constructor(
    @inject('PrismaService')
    private prisma: PrismaService,
    @inject('SpectatorAvatarsRepository')
    private spectatorAvatarsRepository: SpectatorAvatarsRepository,
  ) {}

  async findByEmail(email: string): Promise<Spectator | null> {
    const spectator = await this.prisma.user.findUnique({
      where: {
        email,
        role: 'SPECTATOR',
      },
    })

    if (!spectator) {
      return null
    }

    return PrismaSpectatorMapper.toDomain(spectator)
  }

  async findById(id: string): Promise<Spectator | null> {
    const spectator = await this.prisma.user.findUnique({
      where: {
        id,
        role: 'SPECTATOR',
      },
    })

    if (!spectator) {
      return null
    }

    return PrismaSpectatorMapper.toDomain(spectator)
  }

  async findByIdWithAvatar(id: string): Promise<SpectatorWithAvatar | null> {
    const spectator = await this.prisma.user.findUnique({
      where: {
        id,
        role: 'SPECTATOR',
      },
      include: {
        avatar: true,
      },
    })

    if (!spectator) {
      return null
    }

    return PrismaSpectatorWithAvatarMapper.toDomain(spectator)
  }

  async create(spectator: Spectator): Promise<void> {
    const data = PrismaSpectatorMapper.toPrisma(spectator)

    await this.prisma.user.create({
      data,
    })
  }

  async save(spectator: Spectator): Promise<void> {
    const data = PrismaSpectatorMapper.toPrisma(spectator)

    await this.prisma.user.update({
      where: { id: data.id },
      data,
    })

    if (spectator.avatar) {
      await this.spectatorAvatarsRepository.create(spectator.avatar)
    }
  }
}
