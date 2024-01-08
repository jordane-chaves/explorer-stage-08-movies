import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

import { MovieTagList } from './movie-tag-list'
import { Rating } from './value-objects/rating'

export interface MovieProps {
  spectatorId: UniqueEntityID
  title: string
  description?: string | null
  rating?: Rating | null
  tags: MovieTagList
  watchedAt?: Date | null
  createdAt: Date
  updatedAt?: Date | null
}

export class Movie extends Entity<MovieProps> {
  get spectatorId() {
    return this.props.spectatorId
  }

  get title() {
    return this.props.title
  }

  set title(title: string) {
    this.props.title = title
    this.touch()
  }

  get description() {
    return this.props.description
  }

  set description(description: string | null | undefined) {
    this.props.description = description
    this.touch()
  }

  get rating() {
    return this.props.rating
  }

  set rating(rating: Rating | null | undefined) {
    this.props.rating = rating
    this.touch()
  }

  get tags() {
    return this.props.tags
  }

  set tags(tags: MovieTagList) {
    this.props.tags = tags
    this.touch()
  }

  get watchedAt() {
    return this.props.watchedAt
  }

  set watchedAt(watchedAt: Date | undefined | null) {
    this.props.watchedAt = watchedAt
    this.touch()
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
    props: Optional<MovieProps, 'tags' | 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const movie = new Movie(
      {
        ...props,
        tags: props.tags ?? new MovieTagList(),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return movie
  }
}
