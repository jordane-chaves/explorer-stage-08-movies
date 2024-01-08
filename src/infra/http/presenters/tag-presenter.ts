import { Tag } from '@/domain/enterprise/entities/tag'

export class TagPresenter {
  static toHTTP(tag: Tag) {
    return {
      id: tag.id.toString(),
      authorId: tag.authorId.toString(),
      name: tag.name,
    }
  }
}
