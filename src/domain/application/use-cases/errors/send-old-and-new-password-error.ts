import { UseCaseError } from '@/core/errors/use-case-error'

export class SendOldAndNewPasswordError extends Error implements UseCaseError {
  constructor() {
    super('Send old and new password to edit the password.')
  }
}
