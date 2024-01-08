import { AvatarsRepository } from '@/domain/application/repositories/avatars-repository'
import { Avatar } from '@/domain/enterprise/entities/avatar'

export class InMemoryAvatarsRepository implements AvatarsRepository {
  public items: Avatar[] = []

  async create(avatar: Avatar): Promise<void> {
    this.items.push(avatar)
  }
}
