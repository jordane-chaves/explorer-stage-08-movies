import { PaginationParams } from '@/core/repositories/pagination-params'
import { TagsRepository } from '@/domain/application/repositories/tags-repository'
import { Tag } from '@/domain/enterprise/entities/tag'

export class InMemoryTagsRepository implements TagsRepository {
  public items: Tag[] = []

  async findManyByAuthorId(
    authorId: string,
    { page, perPage }: PaginationParams,
  ): Promise<Tag[]> {
    const tags = this.items
      .filter((item) => item.authorId.toString() === authorId)
      .slice((page - 1) * perPage, page * perPage)

    return tags
  }

  async findById(id: string): Promise<Tag | null> {
    const tag = this.items.find((item) => item.id.toString() === id)

    if (!tag) {
      return null
    }

    return tag
  }

  async create(tag: Tag): Promise<void> {
    this.items.push(tag)
  }

  async save(tag: Tag): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id.equals(tag.id))

    if (itemIndex >= 0) {
      this.items[itemIndex] = tag
    }
  }

  async delete(tag: Tag): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id.equals(tag.id))

    if (itemIndex >= 0) {
      this.items.splice(itemIndex, 1)
    }
  }
}
