import { inject, injectable } from 'tsyringe'

import { AvatarsRepository } from '@/domain/application/repositories/avatars-repository'
import { Avatar } from '@/domain/enterprise/entities/avatar'

import { PrismaService } from '..'

import { PrismaAvatarMapper } from '../mappers/prisma-avatar-mapper'

@injectable()
export class PrismaAvatarsRepository implements AvatarsRepository {
  constructor(
    @inject('PrismaService')
    private prisma: PrismaService,
  ) {}

  async create(avatar: Avatar): Promise<void> {
    const data = PrismaAvatarMapper.toPrisma(avatar)

    await this.prisma.avatar.create({
      data,
    })
  }
}
