import { SpectatorAvatarsRepository } from '@/domain/application/repositories/spectator-avatars-repository'
import { SpectatorAvatar } from '@/domain/enterprise/entities/spectator-avatar'

export class InMemorySpectatorAvatarsRepository
  implements SpectatorAvatarsRepository
{
  public items: SpectatorAvatar[] = []

  async create(avatar: SpectatorAvatar): Promise<void> {
    this.items.push(avatar)
  }

  async deleteBySpectatorId(spectatorId: string): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.spectatorId.toString() === spectatorId,
    )

    if (itemIndex >= 0) {
      this.items.splice(itemIndex, 1)
    }
  }
}
