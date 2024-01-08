import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface MovieTagProps {
  movieId: UniqueEntityID
  tagId: UniqueEntityID
}

export class MovieTag extends Entity<MovieTagProps> {
  get movieId() {
    return this.props.movieId
  }

  get tagId() {
    return this.props.tagId
  }

  static create(props: MovieTagProps, id?: UniqueEntityID) {
    const movieTag = new MovieTag(props, id)

    return movieTag
  }
}
