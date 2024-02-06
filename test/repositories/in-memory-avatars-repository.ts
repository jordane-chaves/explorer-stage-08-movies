import { AvatarsRepository } from '@/domain/application/repositories/avatars-repository'
import { Avatar } from '@/domain/enterprise/entities/avatar'

import { InMemorySpectatorAvatarsRepository } from './in-memory-spectator-avatars-repository'

export class InMemoryAvatarsRepository implements AvatarsRepository {
  public items: Avatar[] = []

  constructor(
    private spectatorAvatarsRepository: InMemorySpectatorAvatarsRepository,
  ) {}

  async findBySpectatorId(spectatorId: string): Promise<Avatar | null> {
    const spectatorAvatar = this.spectatorAvatarsRepository.items.find(
      (item) => item.spectatorId.toString() === spectatorId,
    )

    if (!spectatorAvatar) {
      throw new Error(
        `Spectator avatar for spectator ID ${spectatorId} does not exists.`,
      )
    }

    const avatar = this.items.find((item) =>
      item.id.equals(spectatorAvatar.avatarId),
    )

    if (!avatar) {
      return null
    }

    return avatar
  }

  async findById(id: string): Promise<Avatar | null> {
    const avatar = this.items.find((item) => item.id.toString() === id)

    if (!avatar) {
      return null
    }

    return avatar
  }

  async create(avatar: Avatar): Promise<void> {
    this.items.push(avatar)
  }
}
