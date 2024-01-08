import { DomainError } from '@/core/errors/domain-error'

export class InvalidRatingRangeError extends Error implements DomainError {
  constructor() {
    super('Invalid rating range.')
  }
}
