import { Avatar } from '@/domain/enterprise/entities/avatar'
import { env } from '@/infra/env'

export class AvatarPresenter {
  static toHTTP(avatar: Avatar) {
    const avatarUrl = new URL(avatar.url, env.AWS_BUCKET_PUBLIC_URL).toString()

    return {
      avatar_id: avatar.id.toString(),
      avatar_url: avatarUrl,
    }
  }
}
