import { SpectatorWithAvatar } from '@/domain/enterprise/entities/value-objects/spectator-with-avatar'

export class SpectatorWithAvatarPresenter {
  static toHTTP(spectator: SpectatorWithAvatar) {
    return {
      id: spectator.spectatorId.toString(),
      name: spectator.name,
      email: spectator.email,
      avatar_id: spectator.avatarId?.toString(),
      avatar: spectator.avatar,
      created_at: spectator.createdAt,
      updated_at: spectator.updatedAt,
    }
  }
}
