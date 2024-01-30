import { FakeHasher } from 'test/cryptography/fake-hasher'
import { makeAvatar } from 'test/factories/make-avatar'
import { makeSpectator } from 'test/factories/make-spectator'
import { makeSpectatorAvatar } from 'test/factories/make-spectator-avatar'
import { InMemoryAvatarsRepository } from 'test/repositories/in-memory-avatars-repository'
import { InMemorySpectatorAvatarsRepository } from 'test/repositories/in-memory-spectator-avatars-repository'
import { InMemorySpectatorsRepository } from 'test/repositories/in-memory-spectators-repository'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { EditSpectatorUseCase } from './edit-spectator'
import { NotAllowedError } from './errors/not-allowed-error'
import { SendOldAndNewPasswordError } from './errors/send-old-and-new-password-error'

let inMemoryAvatarsRepository: InMemoryAvatarsRepository
let inMemorySpectatorAvatarsRepository: InMemorySpectatorAvatarsRepository
let inMemorySpectatorsRepository: InMemorySpectatorsRepository
let fakeHasher: FakeHasher

let sut: EditSpectatorUseCase

describe('Edit Spectator', () => {
  beforeEach(() => {
    inMemoryAvatarsRepository = new InMemoryAvatarsRepository()
    inMemorySpectatorAvatarsRepository =
      new InMemorySpectatorAvatarsRepository()
    inMemorySpectatorsRepository = new InMemorySpectatorsRepository(
      inMemorySpectatorAvatarsRepository,
    )

    fakeHasher = new FakeHasher()

    sut = new EditSpectatorUseCase(
      inMemorySpectatorsRepository,
      inMemoryAvatarsRepository,
      inMemorySpectatorAvatarsRepository,
      fakeHasher,
      fakeHasher,
    )
  })

  it('should be able to edit a spectator', async () => {
    const spectator = makeSpectator({}, new UniqueEntityID('spectator-1'))
    inMemorySpectatorsRepository.items.push(spectator)

    spectator.avatar = makeSpectatorAvatar({
      avatarId: new UniqueEntityID('avatar-1'),
      spectatorId: spectator.id,
    })

    inMemorySpectatorAvatarsRepository.items.push(spectator.avatar)

    const avatar2 = makeAvatar({}, new UniqueEntityID('avatar-2'))
    inMemoryAvatarsRepository.items.push(avatar2)

    const result = await sut.execute({
      spectatorId: 'spectator-1',
      avatarId: 'avatar-2',
      name: 'John Doe',
      email: 'johndoe@example.com',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemorySpectatorsRepository.items[0]).toEqual(
      expect.objectContaining({
        name: 'John Doe',
        email: 'johndoe@example.com',
      }),
    )

    expect(inMemorySpectatorAvatarsRepository.items).toHaveLength(1)
    expect(inMemorySpectatorAvatarsRepository.items[0]).toEqual(
      expect.objectContaining({
        avatarId: new UniqueEntityID('avatar-2'),
        spectatorId: new UniqueEntityID('spectator-1'),
      }),
    )
  })

  it('should hash spectator password upon edition', async () => {
    const spectator = makeSpectator(
      {
        passwordHash: await fakeHasher.hash('1234'),
      },
      new UniqueEntityID('spectator-1'),
    )

    inMemorySpectatorsRepository.items.push(spectator)

    const result = await sut.execute({
      spectatorId: 'spectator-1',
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      oldPassword: '1234',
    })

    const hashedPassword = await fakeHasher.hash('123456')

    expect(result.isRight()).toBe(true)
    expect(inMemorySpectatorsRepository.items[0].passwordHash).toEqual(
      hashedPassword,
    )
  })

  it('should send old password when edit the password', async () => {
    const spectator = makeSpectator(
      {
        passwordHash: await fakeHasher.hash('1234'),
      },
      new UniqueEntityID('spectator-1'),
    )

    inMemorySpectatorsRepository.items.push(spectator)

    const result = await sut.execute({
      spectatorId: 'spectator-1',
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(SendOldAndNewPasswordError)
  })

  it('should not edit spectator password with invalid old password', async () => {
    const spectator = makeSpectator(
      {
        passwordHash: await fakeHasher.hash('456789'),
      },
      new UniqueEntityID('spectator-1'),
    )

    inMemorySpectatorsRepository.items.push(spectator)

    const result = await sut.execute({
      spectatorId: 'spectator-1',
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      oldPassword: '1234',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
