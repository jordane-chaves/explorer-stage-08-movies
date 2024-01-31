import { inject, injectable } from 'tsyringe'

import { Either, left, right } from '@/core/either'
import { SpectatorWithAvatar } from '@/domain/enterprise/entities/value-objects/spectator-with-avatar'

import { SpectatorsRepository } from '../repositories/spectators-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface GetSpectatorUseCaseRequest {
  spectatorId: string
}

type GetSpectatorUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    spectator: SpectatorWithAvatar
  }
>

@injectable()
export class GetSpectatorUseCase {
  constructor(
    @inject('SpectatorsRepository')
    private spectatorsRepository: SpectatorsRepository,
  ) {}

  async execute(
    request: GetSpectatorUseCaseRequest,
  ): Promise<GetSpectatorUseCaseResponse> {
    const { spectatorId } = request

    const spectator =
      await this.spectatorsRepository.findByIdWithAvatar(spectatorId)

    if (!spectator) {
      return left(new ResourceNotFoundError())
    }

    return right({
      spectator,
    })
  }
}
