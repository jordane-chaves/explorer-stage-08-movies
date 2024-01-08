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

describe('Fetch Movies (E2E)', () => {
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

  test('[GET] /movies', async () => {
    const spectator = await spectatorFactory.makePrismaSpectator()

    await Promise.all([
      movieFactory.makePrismaMovie({
        spectatorId: spectator.id,
        title: 'Harry Potter',
      }),
      movieFactory.makePrismaMovie({
        spectatorId: spectator.id,
        title: 'The Avengers',
      }),
    ])

    const token = await jwt.encrypt({ sub: spectator.id.toString() })

    const response = await request(app.server)
      .get(`/movies`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      movies: expect.arrayContaining([
        expect.objectContaining({ title: 'Harry Potter' }),
        expect.objectContaining({ title: 'The Avengers' }),
      ]),
    })
  })
})
