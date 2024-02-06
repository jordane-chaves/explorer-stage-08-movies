import { makeAvatar } from 'test/factories/make-avatar'
import { makeMovie } from 'test/factories/make-movie'
import { makeMovieTag } from 'test/factories/make-movie-tag'
import { makeSpectator } from 'test/factories/make-spectator'
import { makeSpectatorAvatar } from 'test/factories/make-spectator-avatar'
import { makeTag } from 'test/factories/make-tag'
import { InMemoryAvatarsRepository } from 'test/repositories/in-memory-avatars-repository'
import { InMemoryMovieTagsRepository } from 'test/repositories/in-memory-movie-tags-repository'
import { InMemoryMoviesRepository } from 'test/repositories/in-memory-movies-repository'
import { InMemorySpectatorAvatarsRepository } from 'test/repositories/in-memory-spectator-avatars-repository'
import { InMemorySpectatorsRepository } from 'test/repositories/in-memory-spectators-repository'
import { InMemoryTagsRepository } from 'test/repositories/in-memory-tags-repository'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { NotAllowedError } from './errors/not-allowed-error'
import { GetMovieUseCase } from './get-movie'

let inMemoryTagsRepository: InMemoryTagsRepository
let inMemoryAvatarsRepository: InMemoryAvatarsRepository
let inMemorySpectatorAvatarsRepository: InMemorySpectatorAvatarsRepository
let inMemorySpectatorsRepository: InMemorySpectatorsRepository
let inMemoryMovieTagsRepository: InMemoryMovieTagsRepository
let inMemoryMoviesRepository: InMemoryMoviesRepository

let sut: GetMovieUseCase

describe('Get Movie', () => {
  beforeEach(() => {
    inMemoryTagsRepository = new InMemoryTagsRepository()
    inMemoryAvatarsRepository = new InMemoryAvatarsRepository()
    inMemorySpectatorAvatarsRepository =
      new InMemorySpectatorAvatarsRepository()
    inMemorySpectatorsRepository = new InMemorySpectatorsRepository(
      inMemorySpectatorAvatarsRepository,
      inMemoryAvatarsRepository,
    )

    inMemoryMovieTagsRepository = new InMemoryMovieTagsRepository()
    inMemoryMoviesRepository = new InMemoryMoviesRepository(
      inMemoryMovieTagsRepository,
      inMemorySpectatorsRepository,
      inMemoryTagsRepository,
    )

    sut = new GetMovieUseCase(inMemoryMoviesRepository)
  })

  it('should be able to get a movie', async () => {
    const avatar = makeAvatar()
    inMemoryAvatarsRepository.items.push(avatar)

    const spectator = makeSpectator()
    inMemorySpectatorsRepository.items.push(spectator)

    inMemorySpectatorAvatarsRepository.items.push(
      makeSpectatorAvatar({
        avatarId: avatar.id,
        spectatorId: spectator.id,
      }),
    )

    const movie = makeMovie(
      {
        spectatorId: spectator.id,
      },
      new UniqueEntityID('movie-1'),
    )

    inMemoryMoviesRepository.items.push(movie)

    const tag = makeTag({ name: 'Action', authorId: spectator.id })
    inMemoryTagsRepository.items.push(tag)

    inMemoryMovieTagsRepository.items.push(
      makeMovieTag({
        movieId: movie.id,
        tagId: tag.id,
      }),
    )

    const result = await sut.execute({
      movieId: 'movie-1',
      spectatorId: spectator.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      movie: expect.objectContaining({
        title: movie.title,
        spectator: expect.objectContaining({
          name: spectator.name,
          avatar: avatar.url,
        }),
      }),
    })
  })

  it('should not be able to get another user movie', async () => {
    const avatar = makeAvatar()
    inMemoryAvatarsRepository.items.push(avatar)

    const spectator = makeSpectator()
    inMemorySpectatorsRepository.items.push(spectator)

    inMemorySpectatorAvatarsRepository.items.push(
      makeSpectatorAvatar({
        avatarId: avatar.id,
        spectatorId: spectator.id,
      }),
    )

    const movie = makeMovie(
      {
        spectatorId: spectator.id,
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
