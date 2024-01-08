import { makeMovie } from 'test/factories/make-movie'
import { makeMovieTag } from 'test/factories/make-movie-tag'
import { InMemoryMovieTagsRepository } from 'test/repositories/in-memory-movie-tags-repository'
import { InMemoryMoviesRepository } from 'test/repositories/in-memory-movies-repository'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Rating } from '@/domain/enterprise/entities/value-objects/rating'

import { EditMovieUseCase } from './edit-movie'
import { NotAllowedError } from './errors/not-allowed-error'

let inMemoryMovieTagsRepository: InMemoryMovieTagsRepository
let inMemoryMoviesRepository: InMemoryMoviesRepository

let sut: EditMovieUseCase

describe('Edit Movie', () => {
  beforeEach(() => {
    inMemoryMovieTagsRepository = new InMemoryMovieTagsRepository()
    inMemoryMoviesRepository = new InMemoryMoviesRepository(
      inMemoryMovieTagsRepository,
    )

    sut = new EditMovieUseCase(
      inMemoryMoviesRepository,
      inMemoryMovieTagsRepository,
    )
  })

  it('should be able to edit a movie', async () => {
    const moviesRepositorySaveSpy = vi.spyOn(inMemoryMoviesRepository, 'save')

    const movie = makeMovie(
      {
        spectatorId: new UniqueEntityID('spectator-1'),
        title: 'Harry',
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
      title: 'Harry Potter',
      description: 'The best film of all time',
      rating: 5,
      watchedAt: new Date(),
      tagsIds: ['1', '3'],
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryMoviesRepository.items[0]).toEqual(
      expect.objectContaining({
        title: 'Harry Potter',
        description: 'The best film of all time',
        rating: Rating.create(5).value,
        watchedAt: expect.any(Date),
      }),
    )
    expect(moviesRepositorySaveSpy).toHaveBeenCalled()

    expect(inMemoryMoviesRepository.items[0].tags.currentItems).toHaveLength(2)
    expect(inMemoryMoviesRepository.items[0].tags.currentItems).toEqual([
      expect.objectContaining({ tagId: new UniqueEntityID('1') }),
      expect.objectContaining({ tagId: new UniqueEntityID('3') }),
    ])
  })

  it('should not be able to edit another user movie', async () => {
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
      title: 'Harry Potter',
      description: 'The best film of all time',
      rating: 5,
      watchedAt: new Date(),
      tagsIds: [],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should sync new and removed tags when editing a movie', async () => {
    const movie = makeMovie(
      {
        spectatorId: new UniqueEntityID('spectator-1'),
        title: 'Harry',
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
      title: 'Harry Potter',
      description: 'The best film of all time',
      rating: 5,
      watchedAt: new Date(),
      tagsIds: ['1', '3'],
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryMovieTagsRepository.items).toHaveLength(2)
    expect(inMemoryMovieTagsRepository.items).toEqual([
      expect.objectContaining({ tagId: new UniqueEntityID('1') }),
      expect.objectContaining({ tagId: new UniqueEntityID('3') }),
    ])
  })
})
