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

describe('Edit Movie (E2E)', () => {
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

  test('[PUT] /movies/:id', async () => {
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

    const tag3 = await tagFactory.makePrismaTag({ authorId: spectator.id })

    const token = await jwt.encrypt({ sub: spectator.id.toString() })
    const movieId = movie.id.toString()

    const response = await request(app.server)
      .put(`/movies/${movieId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Harry Potter',
        tagsIds: [tag1.id.toString(), tag3.id.toString()],
      })

    expect(response.statusCode).toBe(204)

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
    expect(movieTagsOnDatabase).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ tagId: tag1.id.toString() }),
        expect.objectContaining({ tagId: tag3.id.toString() }),
      ]),
    )
  })
})
