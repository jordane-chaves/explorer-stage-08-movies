import { SpectatorsRepository } from '@/domain/application/repositories/spectators-repository'
import { Spectator } from '@/domain/enterprise/entities/spectator'
import { SpectatorWithAvatar } from '@/domain/enterprise/entities/value-objects/spectator-with-avatar'

import { InMemoryAvatarsRepository } from './in-memory-avatars-repository'
import { InMemorySpectatorAvatarsRepository } from './in-memory-spectator-avatars-repository'

export class InMemorySpectatorsRepository implements SpectatorsRepository {
  public items: Spectator[] = []

  constructor(
    private spectatorAvatarsRepository: InMemorySpectatorAvatarsRepository,
    private avatarsRepository: InMemoryAvatarsRepository,
  ) {}

  async findByEmail(email: string): Promise<Spectator | null> {
    const spectator = this.items.find((item) => item.email === email)

    if (!spectator) {
      return null
    }

    return spectator
  }

  async findById(id: string): Promise<Spectator | null> {
    const spectator = this.items.find((item) => item.id.toString() === id)

    if (!spectator) {
      return null
    }

    return spectator
  }

  async findByIdWithAvatar(id: string): Promise<SpectatorWithAvatar | null> {
    const spectator = this.items.find((item) => item.id.toString() === id)

    if (!spectator) {
      return null
    }

    const spectatorAvatar = this.spectatorAvatarsRepository.items.find(
      (spectatorAvatar) => spectatorAvatar.spectatorId.equals(spectator.id),
    )

    if (!spectatorAvatar) {
      throw new Error(`Spectator avatar does not exist.`)
    }

    const avatar = this.avatarsRepository.items.find((avatar) =>
      avatar.id.equals(spectatorAvatar.avatarId),
    )

    return SpectatorWithAvatar.create({
      spectatorId: spectator.id,
      name: spectator.name,
      email: spectator.email,
      avatarId: avatar?.id,
      avatar: avatar?.url,
      createdAt: spectator.createdAt,
      updatedAt: spectator.updatedAt,
    })
  }

  async create(spectator: Spectator): Promise<void> {
    this.items.push(spectator)
  }

  async save(spectator: Spectator): Promise<void> {
    const itemIndex = this.items.findIndex((item) =>
      item.id.equals(spectator.id),
    )

    if (itemIndex >= 0) {
      this.items[itemIndex] = spectator

      if (spectator.avatar) {
        await this.spectatorAvatarsRepository.create(spectator.avatar)
      }
    }
  }
}
