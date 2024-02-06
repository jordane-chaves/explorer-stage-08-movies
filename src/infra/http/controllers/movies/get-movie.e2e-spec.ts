import request from 'supertest'
import { AvatarFactory } from 'test/factories/make-avatar'
import { MovieFactory } from 'test/factories/make-movie'
import { MovieTagFactory } from 'test/factories/make-movie-tag'
import { SpectatorFactory } from 'test/factories/make-spectator'
import { SpectatorAvatarFactory } from 'test/factories/make-spectator-avatar'
import { TagFactory } from 'test/factories/make-tag'

import { app } from '@/infra/app'
import { JwtEncrypter } from '@/infra/cryptography/jwt-encrypter'
import { PrismaService } from '@/infra/database/prisma'

let prisma: PrismaService
let movieFactory: MovieFactory
let spectatorFactory: SpectatorFactory
let avatarFactory: AvatarFactory
let spectatorAvatarFactory: SpectatorAvatarFactory
let movieTagFactory: MovieTagFactory
let tagFactory: TagFactory
let jwt: JwtEncrypter

describe('Get Movie (E2E)', () => {
  beforeAll(async () => {
    prisma = new PrismaService()
    movieFactory = new MovieFactory(prisma)
    spectatorFactory = new SpectatorFactory(prisma)
    avatarFactory = new AvatarFactory(prisma)
    spectatorAvatarFactory = new SpectatorAvatarFactory(prisma)
    movieTagFactory = new MovieTagFactory(prisma)
    tagFactory = new TagFactory(prisma)
    jwt = new JwtEncrypter()

    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[GET] /movies/:id', async () => {
    const avatar = await avatarFactory.makePrismaAvatar()
    const spectator = await spectatorFactory.makePrismaSpectator()

    await spectatorAvatarFactory.makePrismaSpectatorAvatar({
      avatarId: avatar.id,
      spectatorId: spectator.id,
    })

    const movie = await movieFactory.makePrismaMovie({
      spectatorId: spectator.id,
      title: 'Harry Potter',
    })

    const tag = await tagFactory.makePrismaTag({ authorId: spectator.id })

    await movieTagFactory.makePrismaMovieTag({
      movieId: movie.id,
      tagId: tag.id,
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
        spectator: expect.objectContaining({
          name: spectator.name,
          avatar_url: avatar.url,
        }),
        tags: expect.arrayContaining([
          expect.objectContaining({ name: tag.name }),
        ]),
      }),
    })
  })
})
