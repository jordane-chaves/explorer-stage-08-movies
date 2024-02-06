import request from 'supertest'
import { SpectatorFactory } from 'test/factories/make-spectator'

import { app } from '@/infra/app'
import { JwtEncrypter } from '@/infra/cryptography/jwt-encrypter'
import { PrismaService } from '@/infra/database/prisma'

let prisma: PrismaService
let spectatorFactory: SpectatorFactory
let jwt: JwtEncrypter

describe('Create Movie (E2E)', () => {
  beforeAll(async () => {
    prisma = new PrismaService()
    spectatorFactory = new SpectatorFactory(prisma)
    jwt = new JwtEncrypter()

    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[POST] /movies', async () => {
    const spectator = await spectatorFactory.makePrismaSpectator()

    const accessToken = await jwt.encrypt({ sub: spectator.id.toString() })

    const response = await request(app.server)
      .post('/movies')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Harry Potter',
        description: 'The best film of all time',
        rating: 5,
        watchedAt: new Date(),
        tagsNames: ['adventure', 'fantasy'],
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
