import request from 'supertest'
import { SpectatorFactory } from 'test/factories/make-spectator'
import { TagFactory } from 'test/factories/make-tag'

import { app } from '@/infra/app'
import { JwtEncrypter } from '@/infra/cryptography/jwt-encrypter'
import { PrismaService } from '@/infra/database/prisma'

let prisma: PrismaService
let tagFactory: TagFactory
let spectatorFactory: SpectatorFactory
let jwt: JwtEncrypter

describe('Fetch Tags (E2E)', () => {
  beforeAll(async () => {
    prisma = new PrismaService()
    tagFactory = new TagFactory(prisma)
    spectatorFactory = new SpectatorFactory(prisma)
    jwt = new JwtEncrypter()

    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[GET] /tags', async () => {
    const spectator = await spectatorFactory.makePrismaSpectator()

    await Promise.all([
      tagFactory.makePrismaTag({
        authorId: spectator.id,
        name: 'Fantasy',
      }),
      tagFactory.makePrismaTag({
        authorId: spectator.id,
        name: 'Action',
      }),
    ])

    const token = await jwt.encrypt({ sub: spectator.id.toString() })

    const response = await request(app.server)
      .get(`/tags`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      tags: expect.arrayContaining([
        expect.objectContaining({ name: 'Fantasy' }),
        expect.objectContaining({ name: 'Action' }),
      ]),
    })
  })
})
