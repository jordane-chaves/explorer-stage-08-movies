import { inject, injectable } from 'tsyringe'

import { SpectatorAvatarsRepository } from '@/domain/application/repositories/spectator-avatars-repository'
import { SpectatorsRepository } from '@/domain/application/repositories/spectators-repository'
import { Spectator } from '@/domain/enterprise/entities/spectator'

import { PrismaService } from '..'

import { PrismaSpectatorMapper } from '../mappers/prisma-spectator-mapper'

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
