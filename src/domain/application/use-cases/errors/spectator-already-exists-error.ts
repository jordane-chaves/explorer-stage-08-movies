import { UseCaseError } from '@/core/errors/use-case-error'

export class SpectatorAlreadyExistsError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Spectator "${identifier}" already exists.`)
  }
}
