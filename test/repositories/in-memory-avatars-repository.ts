import { AvatarsRepository } from '@/domain/application/repositories/avatars-repository'
import { Avatar } from '@/domain/enterprise/entities/avatar'

export class InMemoryAvatarsRepository implements AvatarsRepository {
  public items: Avatar[] = []

  async findById(id: string): Promise<Avatar | null> {
    const avatar = this.items.find((item) => item.id.toString() === id)

    if (!avatar) {
      return null
    }

    return avatar
  }

  async create(avatar: Avatar): Promise<void> {
    this.items.push(avatar)
  }
}
