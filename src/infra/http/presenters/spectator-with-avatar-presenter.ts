import { SpectatorWithAvatar } from '@/domain/enterprise/entities/value-objects/spectator-with-avatar'
import { env } from '@/infra/env'

export class SpectatorWithAvatarPresenter {
  static toHTTP(spectator: SpectatorWithAvatar) {
    const avatarUrl = spectator.avatar
      ? new URL(spectator.avatar, env.AWS_BUCKET_PUBLIC_URL).toString()
      : null

    return {
      id: spectator.spectatorId.toString(),
      name: spectator.name,
      email: spectator.email,
      avatar_id: spectator.avatarId?.toString(),
      avatar_url: avatarUrl,
      created_at: spectator.createdAt,
      updated_at: spectator.updatedAt,
    }
  }
}
