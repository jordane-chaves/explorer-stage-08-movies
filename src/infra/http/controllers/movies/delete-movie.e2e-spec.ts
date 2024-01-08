import request from 'supertest'
import { MovieFactory } from 'test/factories/make-movie'
import { MovieTagFactory } from 'test/factories/make-movie-tag'
import { SpectatorFactory } from 'test/factories/make-spectator'
import { TagFactory } from 'test/factories/make-tag'

import { app } from '@/infra/app'
import { JwtEncrypter } from '@/infra/cryptography/jwt-encrypter'
import { PrismaService } from '@/infra/database/prisma'

let prisma: PrismaService
let movieFactory: MovieFactory
let spectatorFactory: SpectatorFactory
let movieTagFactory: MovieTagFactory
let tagFactory: TagFactory
let jwt: JwtEncrypter

describe('Delete Movie (E2E)', () => {
  beforeAll(async () => {
    prisma = new PrismaService()
    movieFactory = new MovieFactory(prisma)
    spectatorFactory = new SpectatorFactory(prisma)
    movieTagFactory = new MovieTagFactory(prisma)
    tagFactory = new TagFactory(prisma)
    jwt = new JwtEncrypter()

    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[DELETE] /movies/:id', async () => {
    const spectator = await spectatorFactory.makePrismaSpectator()
    const movie = await movieFactory.makePrismaMovie({
      spectatorId: spectator.id,
    })

    const tag1 = await tagFactory.makePrismaTag({ authorId: spectator.id })
    const tag2 = await tagFactory.makePrismaTag({ authorId: spectator.id })

    await Promise.all([
      movieTagFactory.makePrismaMovieTag({
        movieId: movie.id,
        tagId: tag1.id,
      }),
      movieTagFactory.makePrismaMovieTag({
        movieId: movie.id,
        tagId: tag2.id,
      }),
    ])

    const token = await jwt.encrypt({ sub: spectator.id.toString() })
    const movieId = movie.id.toString()

    const response = await request(app.server)
      .delete(`/movies/${movieId}`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toBe(204)

    const movieOnDatabase = await prisma.movie.findUnique({
      where: {
        id: movieId,
      },
    })

    expect(movieOnDatabase).toBeNull()

    const movieTagsOnDatabase = await prisma.movieTag.findMany({
      where: {
        movieId: movieOnDatabase?.id,
      },
    })

    expect(movieTagsOnDatabase).toHaveLength(0)
  })
})
