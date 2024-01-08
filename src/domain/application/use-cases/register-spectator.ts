import { inject, injectable } from 'tsyringe'

import { Either, left, right } from '@/core/either'
import { Spectator } from '@/domain/enterprise/entities/spectator'

import { HashGenerator } from '../cryptography/hash-generator'
import { SpectatorsRepository } from '../repositories/spectators-repository'
import { SpectatorAlreadyExistsError } from './errors/spectator-already-exists-error'

interface RegisterSpectatorUseCaseRequest {
  name: string
  email: string
  password: string
}

type RegisterSpectatorUseCaseResponse = Either<
  SpectatorAlreadyExistsError,
  {
    spectator: Spectator
  }
>

@injectable()
export class RegisterSpectatorUseCase {
  constructor(
    @inject('SpectatorsRepository')
    private spectatorsRepository: SpectatorsRepository,
    @inject('HashGenerator')
    private hashGenerator: HashGenerator,
  ) {}

  async execute(
    request: RegisterSpectatorUseCaseRequest,
  ): Promise<RegisterSpectatorUseCaseResponse> {
    const { name, email, password } = request

    const spectatorWithSameEmail =
      await this.spectatorsRepository.findByEmail(email)

    if (spectatorWithSameEmail) {
      return left(new SpectatorAlreadyExistsError(email))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const spectator = Spectator.create({
      name,
      email,
      passwordHash: hashedPassword,
    })

    await this.spectatorsRepository.create(spectator)

    return right({
      spectator,
    })
  }
}
