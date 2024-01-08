import { Avatar } from '@/domain/enterprise/entities/avatar'
import { Prisma } from '@prisma/client'

export class PrismaAvatarMapper {
  static toPrisma(avatar: Avatar): Prisma.AvatarUncheckedCreateInput {
    return {
      id: avatar.id.toString(),
      title: avatar.title,
      url: avatar.url,
    }
  }
}
