import { SpectatorAvatarsRepository } from '@/domain/application/repositories/spectator-avatars-repository'
import { SpectatorAvatar } from '@/domain/enterprise/entities/spectator-avatar'

export class InMemorySpectatorAvatarsRepository
  implements SpectatorAvatarsRepository
{
  public items: SpectatorAvatar[] = []

  async create(avatar: SpectatorAvatar): Promise<void> {
    this.items.push(avatar)
  }

  async delete(avatar: SpectatorAvatar): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id.equals(avatar.id))

    if (itemIndex >= 0) {
      this.items.splice(itemIndex, 1)
    }
  }
}
