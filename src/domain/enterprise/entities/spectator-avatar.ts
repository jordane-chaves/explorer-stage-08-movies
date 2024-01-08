import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface SpectatorAvatarProps {
  avatarId: UniqueEntityID
  spectatorId: UniqueEntityID
}

export class SpectatorAvatar extends Entity<SpectatorAvatarProps> {
  get avatarId() {
    return this.props.avatarId
  }

  get spectatorId() {
    return this.props.spectatorId
  }

  static create(props: SpectatorAvatarProps, id?: UniqueEntityID) {
    const spectatorAvatar = new SpectatorAvatar(props, id)

    return spectatorAvatar
  }
}
