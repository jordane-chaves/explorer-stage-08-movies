import { makeMovie } from 'test/factories/make-movie'
import { makeMovieTag } from 'test/factories/make-movie-tag'
import { InMemoryMovieTagsRepository } from 'test/repositories/in-memory-movie-tags-repository'
import { InMemoryMoviesRepository } from 'test/repositories/in-memory-movies-repository'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { DeleteMovieUseCase } from './delete-movie'
import { NotAllowedError } from './errors/not-allowed-error'

let inMemoryMovieTagsRepository: InMemoryMovieTagsRepository
let inMemoryMoviesRepository: InMemoryMoviesRepository

let sut: DeleteMovieUseCase

describe('Delete Movie', () => {
  beforeEach(() => {
    inMemoryMovieTagsRepository = new InMemoryMovieTagsRepository()
    inMemoryMoviesRepository = new InMemoryMoviesRepository(
      inMemoryMovieTagsRepository,
    )

    sut = new DeleteMovieUseCase(inMemoryMoviesRepository)
  })

  it('should be able to delete a movie', async () => {
    const movie = makeMovie(
      {
        spectatorId: new UniqueEntityID('spectator-1'),
      },
      new UniqueEntityID('movie-1'),
    )

    inMemoryMoviesRepository.items.push(movie)

    inMemoryMovieTagsRepository.items.push(
      makeMovieTag({ movieId: movie.id, tagId: new UniqueEntityID('1') }),
      makeMovieTag({ movieId: movie.id, tagId: new UniqueEntityID('2') }),
    )

    const result = await sut.execute({
      movieId: 'movie-1',
      spectatorId: 'spectator-1',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryMoviesRepository.items).toHaveLength(0)
    expect(inMemoryMovieTagsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete another user movie', async () => {
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
