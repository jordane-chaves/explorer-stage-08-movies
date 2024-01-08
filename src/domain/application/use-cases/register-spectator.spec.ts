import { FakeHasher } from 'test/cryptography/fake-hasher'
import { InMemorySpectatorAvatarsRepository } from 'test/repositories/in-memory-spectator-avatars-repository'
import { InMemorySpectatorsRepository } from 'test/repositories/in-memory-spectators-repository'

import { RegisterSpectatorUseCase } from './register-spectator'

let inMemorySpectatorAvatarsRepository: InMemorySpectatorAvatarsRepository
let inMemorySpectatorsRepository: InMemorySpectatorsRepository
let sut: RegisterSpectatorUseCase

let fakeHasher: FakeHasher

describe('Register Spectator', () => {
  beforeEach(() => {
    inMemorySpectatorAvatarsRepository =
      new InMemorySpectatorAvatarsRepository()
    inMemorySpectatorsRepository = new InMemorySpectatorsRepository(
      inMemorySpectatorAvatarsRepository,
    )

    fakeHasher = new FakeHasher()

    sut = new RegisterSpectatorUseCase(inMemorySpectatorsRepository, fakeHasher)
  })

  it('should be able to register a new spectator', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      spectator: inMemorySpectatorsRepository.items[0],
    })
  })

  it('should hash spectator password upon registration', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    const hashedPassword = await fakeHasher.hash('123456')

    expect(result.isRight()).toBe(true)
    expect(inMemorySpectatorsRepository.items[0].passwordHash).toEqual(
      hashedPassword,
    )
  })
})
