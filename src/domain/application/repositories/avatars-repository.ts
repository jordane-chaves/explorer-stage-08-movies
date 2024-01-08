import { Avatar } from '@/domain/enterprise/entities/avatar'

export interface AvatarsRepository {
  create(avatar: Avatar): Promise<void>
}
