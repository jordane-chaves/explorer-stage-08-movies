import { InvalidRatingRangeError } from './errors/invalid-rating-range-error'
import { Rating } from './rating'

describe('Rating', () => {
  it('should be able to create a rating', () => {
    const rating = Rating.create(5)

    expect(rating.isRight()).toBe(true)
    expect(rating.value).toEqual({
      rating: 5,
    })
  })

  it('should not be able to create rating with less than 1', () => {
    const rating = Rating.create(0)

    expect(rating.isLeft()).toBe(true)
    expect(rating.value).toBeInstanceOf(InvalidRatingRangeError)
  })

  it('should not be able to create rating with more than 5', () => {
    const rating = Rating.create(6)

    expect(rating.isLeft()).toBe(true)
    expect(rating.value).toBeInstanceOf(InvalidRatingRangeError)
  })
})
