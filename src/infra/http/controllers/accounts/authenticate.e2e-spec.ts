import request from 'supertest'
import { SpectatorFactory } from 'test/factories/make-spectator'

import { app } from '@/infra/app'
import { BcryptHasher } from '@/infra/cryptography/bcrypt-hasher'
import { PrismaService } from '@/infra/database/prisma'

let prisma: PrismaService
let spectatorFactory: SpectatorFactory
let bcryptHasher: BcryptHasher

describe('Authenticate (E2E)', () => {
  beforeAll(async () => {
    prisma = new PrismaService()
    spectatorFactory = new SpectatorFactory(prisma)
    bcryptHasher = new BcryptHasher()

    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[POST] /sessions', async () => {
    await spectatorFactory.makePrismaSpectator({
      email: 'johndoe2@example.com',
      passwordHash: await bcryptHasher.hash('123456'),
    })

    const response = await request(app.server).post('/sessions').send({
      email: 'johndoe2@example.com',
      password: '123456',
    })

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({
      access_token: expect.any(String),
    })
  })
})
