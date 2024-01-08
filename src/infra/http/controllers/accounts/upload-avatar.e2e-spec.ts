import request from 'supertest'
import { SpectatorFactory } from 'test/factories/make-spectator'

import { app } from '@/infra/app'
import { JwtEncrypter } from '@/infra/cryptography/jwt-encrypter'
import { PrismaService } from '@/infra/database/prisma'

let prisma: PrismaService
let spectatorFactory: SpectatorFactory
let jwt: JwtEncrypter

describe('Upload Avatar (E2E)', () => {
  beforeAll(async () => {
    prisma = new PrismaService()
    spectatorFactory = new SpectatorFactory(prisma)
    jwt = new JwtEncrypter()

    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[POST] /avatar', async () => {
    const spectator = await spectatorFactory.makePrismaSpectator()
    const token = await jwt.encrypt({ sub: spectator.id.toString() })

    const response = await request(app.server)
      .post('/avatar')
      .set('Authorization', `Bearer ${token}`)
      .attach('file', './test/e2e/sample-upload.png')

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({
      avatarId: expect.any(String),
    })
  })
})
