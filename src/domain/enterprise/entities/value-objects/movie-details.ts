import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'

import { Tag } from '../tag'
import { Rating } from './rating'
import { SpectatorWithAvatar } from './spectator-with-avatar'

export interface MovieDetailsProps {
  movieId: UniqueEntityID
  spectatorId: UniqueEntityID
  spectator: SpectatorWithAvatar
  title: string
  description?: string | null
  rating?: Rating | null
  tags: Tag[]
  watchedAt?: Date | null
  createdAt: Date
  updatedAt?: Date | null
}

export class MovieDetails extends ValueObject<MovieDetailsProps> {
  get movieId() {
    return this.props.movieId
  }

  get spectatorId() {
    return this.props.spectatorId
  }

  get spectator() {
    return this.props.spectator
  }

  get title() {
    return this.props.title
  }

  get description() {
    return this.props.description
  }

  get rating() {
    return this.props.rating
  }

  get tags() {
    return this.props.tags
  }

  get watchedAt() {
    return this.props.watchedAt
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  static create(props: MovieDetailsProps) {
    return new MovieDetails(props)
  }
}
