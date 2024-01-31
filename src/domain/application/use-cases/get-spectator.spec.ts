import { makeAvatar } from 'test/factories/make-avatar'
import { makeSpectator } from 'test/factories/make-spectator'
import { makeSpectatorAvatar } from 'test/factories/make-spectator-avatar'
import { InMemoryAvatarsRepository } from 'test/repositories/in-memory-avatars-repository'
import { InMemorySpectatorAvatarsRepository } from 'test/repositories/in-memory-spectator-avatars-repository'
import { InMemorySpectatorsRepository } from 'test/repositories/in-memory-spectators-repository'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { GetSpectatorUseCase } from './get-spectator'

let inMemorySpectatorAvatarsRepository: InMemorySpectatorAvatarsRepository
let inMemoryAvatarsRepository: InMemoryAvatarsRepository
let inMemorySpectatorsRepository: InMemorySpectatorsRepository
let sut: GetSpectatorUseCase

describe('Get Spectator', () => {
  beforeEach(() => {
    inMemorySpectatorAvatarsRepository =
      new InMemorySpectatorAvatarsRepository()
    inMemoryAvatarsRepository = new InMemoryAvatarsRepository()
    inMemorySpectatorsRepository = new InMemorySpectatorsRepository(
      inMemorySpectatorAvatarsRepository,
      inMemoryAvatarsRepository,
    )

    sut = new GetSpectatorUseCase(inMemorySpectatorsRepository)
  })

  it('should be able to get a spectator', async () => {
    const spectator = makeSpectator({}, new UniqueEntityID('spectator-1'))
    inMemorySpectatorsRepository.items.push(spectator)

    const avatar = makeAvatar()
    inMemoryAvatarsRepository.items.push(avatar)

    inMemorySpectatorAvatarsRepository.items.push(
      makeSpectatorAvatar({
        avatarId: avatar.id,
        spectatorId: spectator.id,
      }),
    )

    const result = await sut.execute({
      spectatorId: 'spectator-1',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      spectator: expect.objectContaining({
        name: spectator.name,
        avatar: avatar.url,
      }),
    })
  })
})
