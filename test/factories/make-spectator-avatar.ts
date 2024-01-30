import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  SpectatorAvatar,
  SpectatorAvatarProps,
} from '@/domain/enterprise/entities/spectator-avatar'

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
