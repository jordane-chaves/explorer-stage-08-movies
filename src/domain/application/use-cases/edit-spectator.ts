import { inject, injectable } from 'tsyringe'

import { Either, left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { SpectatorAvatar } from '@/domain/enterprise/entities/spectator-avatar'

import { HashComparer } from '../cryptography/hash-comparer'
import { HashGenerator } from '../cryptography/hash-generator'
import { AvatarsRepository } from '../repositories/avatars-repository'
import { SpectatorAvatarsRepository } from '../repositories/spectator-avatars-repository'
import { SpectatorsRepository } from '../repositories/spectators-repository'
import { Eraser } from '../storage/eraser'
import { NotAllowedError } from './errors/not-allowed-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { SendOldAndNewPasswordError } from './errors/send-old-and-new-password-error'

interface EditSpectatorUseCaseRequest {
  spectatorId: string
  avatarId?: string
  name: string
  email: string
  password?: string
  oldPassword?: string
}

type EditSpectatorUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError | SendOldAndNewPasswordError,
  null
>

@injectable()
export class EditSpectatorUseCase {
  constructor(
    @inject('SpectatorsRepository')
    private spectatorsRepository: SpectatorsRepository,
    @inject('AvatarsRepository')
    private avatarsRepository: AvatarsRepository,
    @inject('SpectatorAvatarsRepository')
    private spectatorAvatarsRepository: SpectatorAvatarsRepository,
    @inject('HashGenerator')
    private hashGenerator: HashGenerator,
    @inject('HashComparer')
    private hashComparer: HashComparer,
    @inject('Eraser')
    private eraser: Eraser,
  ) {}

  async execute(
    request: EditSpectatorUseCaseRequest,
  ): Promise<EditSpectatorUseCaseResponse> {
    const { spectatorId, avatarId, name, email, password, oldPassword } =
      request

    if (password && !oldPassword) {
      return left(new SendOldAndNewPasswordError())
    }

    const spectator = await this.spectatorsRepository.findById(spectatorId)

    if (!spectator) {
      return left(new ResourceNotFoundError())
    }

    if (password && oldPassword) {
      const isOldPasswordValid = await this.hashComparer.compare(
        oldPassword,
        spectator.passwordHash,
      )

      if (!isOldPasswordValid) {
        return left(new NotAllowedError())
      }

      spectator.passwordHash = await this.hashGenerator.hash(password)
    }

    if (avatarId) {
      const oldAvatar =
        await this.avatarsRepository.findBySpectatorId(spectatorId)

      if (oldAvatar) {
        await this.eraser.delete(oldAvatar.url)
      }

      await this.spectatorAvatarsRepository.deleteBySpectatorId(spectatorId)

      const avatar = await this.avatarsRepository.findById(avatarId)

      if (avatar) {
        const spectatorAvatar = SpectatorAvatar.create({
          avatarId: new UniqueEntityID(avatarId),
          spectatorId: spectator.id,
        })

        spectator.avatar = spectatorAvatar
      }
    }

    spectator.name = name
    spectator.email = email

    await this.spectatorsRepository.save(spectator)

    return right(null)
  }
}
