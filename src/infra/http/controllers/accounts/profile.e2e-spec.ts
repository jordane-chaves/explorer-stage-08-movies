import request from 'supertest'
import { AvatarFactory } from 'test/factories/make-avatar'
import { SpectatorFactory } from 'test/factories/make-spectator'
import { SpectatorAvatarFactory } from 'test/factories/make-spectator-avatar'

import { app } from '@/infra/app'
import { BcryptHasher } from '@/infra/cryptography/bcrypt-hasher'
import { JwtEncrypter } from '@/infra/cryptography/jwt-encrypter'
import { PrismaService } from '@/infra/database/prisma'

let prisma: PrismaService
let spectatorFactory: SpectatorFactory
let spectatorAvatarFactory: SpectatorAvatarFactory
let avatarFactory: AvatarFactory
let bcryptHasher: BcryptHasher
let jwt: JwtEncrypter

describe('Profile (E2E)', () => {
  beforeAll(async () => {
    prisma = new PrismaService()
    spectatorFactory = new SpectatorFactory(prisma)
    spectatorAvatarFactory = new SpectatorAvatarFactory(prisma)
    avatarFactory = new AvatarFactory(prisma)
    bcryptHasher = new BcryptHasher()
    jwt = new JwtEncrypter()

    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[GET] /profile', async () => {
    const spectator = await spectatorFactory.makePrismaSpectator({
      passwordHash: await bcryptHasher.hash('4321'),
    })

    const avatar = await avatarFactory.makePrismaAvatar()

    await spectatorAvatarFactory.makePrismaSpectatorAvatar({
      avatarId: avatar.id,
      spectatorId: spectator.id,
    })

    const accessToken = await jwt.encrypt({ sub: spectator.id.toString() })

    const response = await request(app.server)
      .get('/profile')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      user: expect.objectContaining({
        name: spectator.name,
        avatar_url: avatar.url,
      }),
    })
  })
})
