import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface TagProps {
  authorId: UniqueEntityID
  name: string
}

export class Tag extends Entity<TagProps> {
  get authorId() {
    return this.props.authorId
  }

  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
  }

  static create(props: TagProps, id?: UniqueEntityID) {
    const tag = new Tag(props, id)

    return tag
  }
}
