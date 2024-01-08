import { Either, left, right } from '@/core/either'

import { InvalidRatingRangeError } from './errors/invalid-rating-range-error'

export class Rating {
  private rating: number

  get value() {
    return this.rating
  }

  private static validateRatingRange(rating: number) {
    return rating >= 1 && rating <= 5
  }

  private constructor(rating: number) {
    this.rating = rating
  }

  static create(rating: number): Either<InvalidRatingRangeError, Rating> {
    const isValidRatingRange = this.validateRatingRange(rating)

    if (!isValidRatingRange) {
      return left(new InvalidRatingRangeError())
    }

    return right(new Rating(rating))
  }
}
