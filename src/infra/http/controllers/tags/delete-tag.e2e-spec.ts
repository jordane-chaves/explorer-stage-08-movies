import request from 'supertest'
import { SpectatorFactory } from 'test/factories/make-spectator'
import { TagFactory } from 'test/factories/make-tag'

import { app } from '@/infra/app'
import { JwtEncrypter } from '@/infra/cryptography/jwt-encrypter'
import { PrismaService } from '@/infra/database/prisma'

let prisma: PrismaService
let spectatorFactory: SpectatorFactory
let tagFactory: TagFactory
let jwt: JwtEncrypter

describe('Delete Tag (E2E)', () => {
  beforeAll(async () => {
    prisma = new PrismaService()
    spectatorFactory = new SpectatorFactory(prisma)
    tagFactory = new TagFactory(prisma)
    jwt = new JwtEncrypter()

    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[DELETE] /tags/:id', async () => {
    const spectator = await spectatorFactory.makePrismaSpectator()
    const tag = await tagFactory.makePrismaTag({
      authorId: spectator.id,
    })

    const token = await jwt.encrypt({ sub: spectator.id.toString() })
    const tagId = tag.id.toString()

    const response = await request(app.server)
      .delete(`/tags/${tagId}`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toBe(204)

    const tagOnDatabase = await prisma.tag.findUnique({
      where: {
        id: tagId,
      },
    })

    expect(tagOnDatabase).toBeNull()
  })
})
