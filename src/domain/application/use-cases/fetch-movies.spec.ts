import { makeMovie } from 'test/factories/make-movie'
import { InMemoryMovieTagsRepository } from 'test/repositories/in-memory-movie-tags-repository'
import { InMemoryMoviesRepository } from 'test/repositories/in-memory-movies-repository'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { FetchMoviesUseCase } from './fetch-movies'

let inMemoryMovieTagsRepository: InMemoryMovieTagsRepository
let inMemoryMoviesRepository: InMemoryMoviesRepository

let sut: FetchMoviesUseCase

describe('Fetch Movies', () => {
  beforeEach(() => {
    inMemoryMovieTagsRepository = new InMemoryMovieTagsRepository()
    inMemoryMoviesRepository = new InMemoryMoviesRepository(
      inMemoryMovieTagsRepository,
    )

    sut = new FetchMoviesUseCase(inMemoryMoviesRepository)
  })

  it('should be able to fetch spectator movies', async () => {
    inMemoryMoviesRepository.items.push(
      makeMovie({ spectatorId: new UniqueEntityID('spectator-1') }),
      makeMovie({ spectatorId: new UniqueEntityID('spectator-1') }),
      makeMovie({ spectatorId: new UniqueEntityID('spectator-1') }),
    )

    const result = await sut.execute({
      spectatorId: 'spectator-1',
      page: 1,
      perPage: 20,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      movies: [
        expect.objectContaining({
          spectatorId: new UniqueEntityID('spectator-1'),
        }),
        expect.objectContaining({
          spectatorId: new UniqueEntityID('spectator-1'),
        }),
        expect.objectContaining({
          spectatorId: new UniqueEntityID('spectator-1'),
        }),
      ],
    })
  })

  it('should fetch paginated spectator movies', async () => {
    for (let i = 1; i <= 22; i++) {
      inMemoryMoviesRepository.items.push(
        makeMovie({ spectatorId: new UniqueEntityID('spectator-1') }),
      )
    }

    const result = await sut.execute({
      spectatorId: 'spectator-1',
      page: 2,
      perPage: 20,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.movies).toHaveLength(2)
  })
})
