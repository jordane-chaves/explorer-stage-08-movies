import { PaginationParams } from '@/core/repositories/pagination-params'
import { Tag } from '@/domain/enterprise/entities/tag'

export interface TagsRepository {
  findManyByAuthorId(authorId: string, params: PaginationParams): Promise<Tag[]>
  findById(id: string): Promise<Tag | null>
  create(tag: Tag): Promise<void>
  save(tag: Tag): Promise<void>
  delete(tag: Tag): Promise<void>
}
