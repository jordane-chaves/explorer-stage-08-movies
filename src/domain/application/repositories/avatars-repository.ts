import { Avatar } from '@/domain/enterprise/entities/avatar'

export interface AvatarsRepository {
  findBySpectatorId(spectatorId: string): Promise<Avatar | null>
  findById(id: string): Promise<Avatar | null>
  create(avatar: Avatar): Promise<void>
}
