import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'

export interface SpectatorWithAvatarProps {
  spectatorId: UniqueEntityID
  name: string
  email: string
  avatarId?: UniqueEntityID | null
  avatar?: string | null
  createdAt: Date
  updatedAt?: Date | null
}

export class SpectatorWithAvatar extends ValueObject<SpectatorWithAvatarProps> {
  get spectatorId() {
    return this.props.spectatorId
  }

  get name() {
    return this.props.name
  }

  get email() {
    return this.props.email
  }

  get avatarId() {
    return this.props.avatarId
  }

  get avatar() {
    return this.props.avatar
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  static create(props: SpectatorWithAvatarProps) {
    return new SpectatorWithAvatar(props)
  }
}
