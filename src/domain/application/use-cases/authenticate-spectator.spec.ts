import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { makeSpectator } from 'test/factories/make-spectator'
import { InMemorySpectatorsRepository } from 'test/repositories/in-memory-spectators-repository'

import { AuthenticateSpectatorUseCase } from './authenticate-spectator'

let inMemorySpectatorsRepository: InMemorySpectatorsRepository
let sut: AuthenticateSpectatorUseCase

let fakeEncrypter: FakeEncrypter
let fakeHasher: FakeHasher

describe('Authenticate Spectator', () => {
  beforeEach(() => {
    inMemorySpectatorsRepository = new InMemorySpectatorsRepository()

    fakeEncrypter = new FakeEncrypter()
    fakeHasher = new FakeHasher()

    sut = new AuthenticateSpectatorUseCase(
      inMemorySpectatorsRepository,
      fakeHasher,
      fakeEncrypter,
    )
  })

  it('should be able to authenticate a spectator', async () => {
    const spectator = makeSpectator({
      email: 'johndoe@example.com',
      passwordHash: await fakeHasher.hash('123456'),
    })

    inMemorySpectatorsRepository.items.push(spectator)

    const result = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })
  })
})
