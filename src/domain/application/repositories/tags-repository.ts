import { PaginationParams } from '@/core/repositories/pagination-params'
import { Tag } from '@/domain/enterprise/entities/tag'

export interface TagsRepository {
  findManyByAuthorId(authorId: string, params: PaginationParams): Promise<Tag[]>
  findManyByAuthorIdAndNames(authorId: string, names: string[]): Promise<Tag[]>
  findByAuthorIdAndName(authorId: string, name: string): Promise<Tag | null>
  findById(id: string): Promise<Tag | null>
  createMany(tags: Tag[]): Promise<void>
  create(tag: Tag): Promise<void>
  save(tag: Tag): Promise<void>
  delete(tag: Tag): Promise<void>
}
