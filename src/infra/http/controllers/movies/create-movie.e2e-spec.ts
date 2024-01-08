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

describe('Create Movie (E2E)', () => {
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

  test('[POST] /movies', async () => {
    const spectator = await spectatorFactory.makePrismaSpectator()

    const tag1 = await tagFactory.makePrismaTag({ authorId: spectator.id })
    const tag2 = await tagFactory.makePrismaTag({ authorId: spectator.id })

    const accessToken = await jwt.encrypt({ sub: spectator.id.toString() })

    const response = await request(app.server)
      .post('/movies')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Harry Potter',
        description: 'The best film of all time',
        rating: 5,
        watchedAt: new Date(),
        tagsIds: [tag1.id.toString(), tag2.id.toString()],
      })

    expect(response.statusCode).toBe(201)

    const movieOnDatabase = await prisma.movie.findFirst({
      where: {
        title: 'Harry Potter',
      },
    })

    expect(movieOnDatabase).toBeTruthy()

    const movieTagsOnDatabase = await prisma.movieTag.findMany({
      where: {
        movieId: movieOnDatabase?.id,
      },
    })

    expect(movieTagsOnDatabase).toHaveLength(2)
  })
})
