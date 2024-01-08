import { inject, injectable } from 'tsyringe'

import { Either, left, right } from '@/core/either'

import { Encrypter } from '../cryptography/encrypter'
import { HashComparer } from '../cryptography/hash-comparer'
import { SpectatorsRepository } from '../repositories/spectators-repository'
import { WrongCredentialsError } from './errors/wrong-credentials-error'

interface AuthenticateSpectatorUseCaseRequest {
  email: string
  password: string
}

type AuthenticateSpectatorUseCaseResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string
  }
>

@injectable()
export class AuthenticateSpectatorUseCase {
  constructor(
    @inject('SpectatorsRepository')
    private spectatorsRepository: SpectatorsRepository,
    @inject('HashComparer')
    private hashComparer: HashComparer,
    @inject('Encrypter')
    private encrypter: Encrypter,
  ) {}

  async execute(
    request: AuthenticateSpectatorUseCaseRequest,
  ): Promise<AuthenticateSpectatorUseCaseResponse> {
    const { email, password } = request

    const spectator = await this.spectatorsRepository.findByEmail(email)

    if (!spectator) {
      return left(new WrongCredentialsError())
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      spectator.passwordHash,
    )

    if (!isPasswordValid) {
      return left(new WrongCredentialsError())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: spectator.id.toString(),
    })

    return right({
      accessToken,
    })
  }
}
