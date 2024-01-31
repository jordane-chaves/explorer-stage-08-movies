import { Spectator } from '@/domain/enterprise/entities/spectator'
import { SpectatorWithAvatar } from '@/domain/enterprise/entities/value-objects/spectator-with-avatar'

export interface SpectatorsRepository {
  findByEmail(email: string): Promise<Spectator | null>
  findById(id: string): Promise<Spectator | null>
  findByIdWithAvatar(id: string): Promise<SpectatorWithAvatar | null>
  create(spectator: Spectator): Promise<void>
  save(spectator: Spectator): Promise<void>
}
