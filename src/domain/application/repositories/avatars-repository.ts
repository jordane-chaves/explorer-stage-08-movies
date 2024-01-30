import { Avatar } from '@/domain/enterprise/entities/avatar'

export interface AvatarsRepository {
  findById(id: string): Promise<Avatar | null>
  create(avatar: Avatar): Promise<void>
}
