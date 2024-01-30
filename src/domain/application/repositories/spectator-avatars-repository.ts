import { SpectatorAvatar } from '@/domain/enterprise/entities/spectator-avatar'

export interface SpectatorAvatarsRepository {
  create(avatar: SpectatorAvatar): Promise<void>
  delete(avatar: SpectatorAvatar): Promise<void>
}
