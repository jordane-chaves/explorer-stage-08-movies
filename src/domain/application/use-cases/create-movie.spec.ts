import { InMemoryMovieTagsRepository } from 'test/repositories/in-memory-movie-tags-repository'
import { InMemoryMoviesRepository } from 'test/repositories/in-memory-movies-repository'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Rating } from '@/domain/enterprise/entities/value-objects/rating'

import { CreateMovieUseCase } from './create-movie'

let inMemoryMovieTagsRepository: InMemoryMovieTagsRepository
let inMemoryMoviesRepository: InMemoryMoviesRepository

let sut: CreateMovieUseCase

describe('Create Movie', () => {
  beforeEach(() => {
    inMemoryMovieTagsRepository = new InMemoryMovieTagsRepository()
    inMemoryMoviesRepository = new InMemoryMoviesRepository(
      inMemoryMovieTagsRepository,
    )

    sut = new CreateMovieUseCase(inMemoryMoviesRepository)
  })

  it('should be able to create a movie', async () => {
    const result = await sut.execute({
      spectatorId: 'spectator-1',
      title: 'Harry Potter',
      rating: 5,
      tagsIds: ['1', '2'],
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      movie: inMemoryMoviesRepository.items[0],
    })
    expect(inMemoryMoviesRepository.items[0]).toEqual(
      expect.objectContaining({
        rating: Rating.create(5).value,
      }),
    )

    expect(inMemoryMoviesRepository.items[0].tags.currentItems).toHaveLength(2)
    expect(inMemoryMoviesRepository.items[0].tags.currentItems).toEqual([
      expect.objectContaining({ tagId: new UniqueEntityID('1') }),
      expect.objectContaining({ tagId: new UniqueEntityID('2') }),
    ])
  })

  it('should persist tags when creating a new movie', async () => {
    const result = await sut.execute({
      spectatorId: 'spectator-1',
      title: 'Harry Potter',
      rating: 5,
      tagsIds: ['1', '2'],
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryMovieTagsRepository.items).toHaveLength(2)
    expect(inMemoryMovieTagsRepository.items).toEqual([
      expect.objectContaining({ tagId: new UniqueEntityID('1') }),
      expect.objectContaining({ tagId: new UniqueEntityID('2') }),
    ])
  })
})
