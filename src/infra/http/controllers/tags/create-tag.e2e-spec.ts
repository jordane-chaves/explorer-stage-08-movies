import request from 'supertest'
import { SpectatorFactory } from 'test/factories/make-spectator'

import { app } from '@/infra/app'
import { JwtEncrypter } from '@/infra/cryptography/jwt-encrypter'
import { PrismaService } from '@/infra/database/prisma'

let prisma: PrismaService
let spectatorFactory: SpectatorFactory
let jwt: JwtEncrypter

describe('Create Tag (E2E)', () => {
  beforeAll(async () => {
    prisma = new PrismaService()
    spectatorFactory = new SpectatorFactory(prisma)
    jwt = new JwtEncrypter()

    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[POST] /tags', async () => {
    const spectator = await spectatorFactory.makePrismaSpectator()

    const accessToken = await jwt.encrypt({ sub: spectator.id.toString() })

    const response = await request(app.server)
      .post('/tags')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Fantasy',
      })

    expect(response.statusCode).toBe(201)

    const tagOnDatabase = await prisma.tag.findFirst({
      where: {
        name: 'Fantasy',
      },
    })

    expect(tagOnDatabase).toBeTruthy()
  })
})
