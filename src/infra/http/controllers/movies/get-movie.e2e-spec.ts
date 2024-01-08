import request from 'supertest'
import { MovieFactory } from 'test/factories/make-movie'
import { SpectatorFactory } from 'test/factories/make-spectator'

import { app } from '@/infra/app'
import { JwtEncrypter } from '@/infra/cryptography/jwt-encrypter'
import { PrismaService } from '@/infra/database/prisma'

let prisma: PrismaService
let movieFactory: MovieFactory
let spectatorFactory: SpectatorFactory
let jwt: JwtEncrypter

describe('Get Movie (E2E)', () => {
  beforeAll(async () => {
    prisma = new PrismaService()
    movieFactory = new MovieFactory(prisma)
    spectatorFactory = new SpectatorFactory(prisma)
    jwt = new JwtEncrypter()

    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[GET] /movies/:id', async () => {
    const spectator = await spectatorFactory.makePrismaSpectator()
    const movie = await movieFactory.makePrismaMovie({
      spectatorId: spectator.id,
      title: 'Harry Potter',
    })

    const token = await jwt.encrypt({ sub: spectator.id.toString() })
    const movieId = movie.id.toString()

    const response = await request(app.server)
      .get(`/movies/${movieId}`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      movie: expect.objectContaining({
        title: 'Harry Potter',
      }),
    })
  })
})
