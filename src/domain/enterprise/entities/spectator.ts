import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

import { SpectatorAvatar } from './spectator-avatar'

export interface SpectatorProps {
  name: string
  email: string
  passwordHash: string
  avatar?: SpectatorAvatar | null
  createdAt: Date
  updatedAt?: Date | null
}

export class Spectator extends Entity<SpectatorProps> {
  get name() {
    return this.props.name
  }

  get email() {
    return this.props.email
  }

  get passwordHash() {
    return this.props.passwordHash
  }

  get avatar() {
    return this.props.avatar
  }

  set avatar(avatar: SpectatorAvatar | null | undefined) {
    this.props.avatar = avatar
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<SpectatorProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const spectator = new Spectator(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return spectator
  }
}
