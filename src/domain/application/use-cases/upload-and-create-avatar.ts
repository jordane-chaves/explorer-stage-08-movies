import { inject, injectable } from 'tsyringe'

import { Either, left, right } from '@/core/either'
import { Avatar } from '@/domain/enterprise/entities/avatar'

import { AvatarsRepository } from '../repositories/avatars-repository'
import { Uploader } from '../storage/uploader'
import { InvalidAvatarTypeError } from './errors/invalid-avatar-type-error'

interface UploadAndCreateAvatarUseCaseRequest {
  fileName: string
  fileType: string
  body: Buffer
}

type UploadAndCreateAvatarUseCaseResponse = Either<
  InvalidAvatarTypeError,
  {
    avatar: Avatar
  }
>

@injectable()
export class UploadAndCreateAvatarUseCase {
  constructor(
    @inject('AvatarsRepository')
    private avatarsRepository: AvatarsRepository,
    @inject('Uploader')
    private uploader: Uploader,
  ) {}

  async execute(
    request: UploadAndCreateAvatarUseCaseRequest,
  ): Promise<UploadAndCreateAvatarUseCaseResponse> {
    const { fileName, fileType, body } = request

    const isValidFileType = /^image\/(?:jpeg|png)$/.test(fileType)

    if (!isValidFileType) {
      return left(new InvalidAvatarTypeError(fileType))
    }

    const { url } = await this.uploader.upload({
      fileName,
      fileType,
      body,
    })

    const avatar = Avatar.create({
      title: fileName,
      url,
    })

    await this.avatarsRepository.create(avatar)

    return right({
      avatar,
    })
  }
}
