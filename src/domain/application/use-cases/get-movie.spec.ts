import { makeMovie } from 'test/factories/make-movie'
import { InMemoryMovieTagsRepository } from 'test/repositories/in-memory-movie-tags-repository'
import { InMemoryMoviesRepository } from 'test/repositories/in-memory-movies-repository'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { NotAllowedError } from './errors/not-allowed-error'
import { GetMovieUseCase } from './get-movie'

let inMemoryMovieTagsRepository: InMemoryMovieTagsRepository
let inMemoryMoviesRepository: InMemoryMoviesRepository

let sut: GetMovieUseCase

describe('Get Movie', () => {
  beforeEach(() => {
    inMemoryMovieTagsRepository = new InMemoryMovieTagsRepository()
    inMemoryMoviesRepository = new InMemoryMoviesRepository(
      inMemoryMovieTagsRepository,
    )

    sut = new GetMovieUseCase(inMemoryMoviesRepository)
  })

  it('should be able to get a movie', async () => {
    const movie = makeMovie(
      {
        spectatorId: new UniqueEntityID('spectator-1'),
      },
      new UniqueEntityID('movie-1'),
    )

    inMemoryMoviesRepository.items.push(movie)

    const result = await sut.execute({
      movieId: 'movie-1',
      spectatorId: 'spectator-1',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      movie: inMemoryMoviesRepository.items[0],
    })
  })

  it('should not be able to get another user movie', async () => {
    const movie = makeMovie(
      {
        spectatorId: new UniqueEntityID('spectator-1'),
      },
      new UniqueEntityID('movie-1'),
    )

    inMemoryMoviesRepository.items.push(movie)

    const result = await sut.execute({
      movieId: 'movie-1',
      spectatorId: 'spectator-2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
