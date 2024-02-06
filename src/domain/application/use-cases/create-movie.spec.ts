import { makeTag } from 'test/factories/make-tag'
import { InMemoryMovieTagsRepository } from 'test/repositories/in-memory-movie-tags-repository'
import { InMemoryMoviesRepository } from 'test/repositories/in-memory-movies-repository'
import { InMemoryTagsRepository } from 'test/repositories/in-memory-tags-repository'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Rating } from '@/domain/enterprise/entities/value-objects/rating'

import { CreateMovieUseCase } from './create-movie'

let inMemoryMovieTagsRepository: InMemoryMovieTagsRepository
let inMemoryMoviesRepository: InMemoryMoviesRepository
let inMemoryTagsRepository: InMemoryTagsRepository

let sut: CreateMovieUseCase

describe('Create Movie', () => {
  beforeEach(() => {
    inMemoryMovieTagsRepository = new InMemoryMovieTagsRepository()
    inMemoryMoviesRepository = new InMemoryMoviesRepository(
      inMemoryMovieTagsRepository,
    )
    inMemoryTagsRepository = new InMemoryTagsRepository()

    sut = new CreateMovieUseCase(
      inMemoryMoviesRepository,
      inMemoryTagsRepository,
    )
  })

  it('should be able to create a movie', async () => {
    const result = await sut.execute({
      spectatorId: 'spectator-1',
      title: 'Harry Potter',
      rating: 5,
      tagsNames: ['adventure', 'fantasy'],
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
  })

  it('should persist tags when creating a new movie', async () => {
    const result = await sut.execute({
      spectatorId: 'spectator-1',
      title: 'Harry Potter',
      rating: 5,
      tagsNames: ['adventure', 'fantasy'],
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryMovieTagsRepository.items).toHaveLength(2)
    expect(inMemoryTagsRepository.items).toEqual([
      expect.objectContaining({ name: 'adventure' }),
      expect.objectContaining({ name: 'fantasy' }),
    ])
  })

  it('should not create a tag two times', async () => {
    inMemoryTagsRepository.items.push(
      makeTag({
        authorId: new UniqueEntityID('spectator-1'),
        name: 'adventure',
      }),
    )

    const result = await sut.execute({
      spectatorId: 'spectator-1',
      title: 'Harry Potter',
      rating: 5,
      tagsNames: ['adventure', 'fantasy'],
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryMovieTagsRepository.items).toHaveLength(2)
    expect(inMemoryTagsRepository.items).toHaveLength(2)
    expect(inMemoryTagsRepository.items).toEqual([
      expect.objectContaining({ name: 'adventure' }),
      expect.objectContaining({ name: 'fantasy' }),
    ])
  })
})
