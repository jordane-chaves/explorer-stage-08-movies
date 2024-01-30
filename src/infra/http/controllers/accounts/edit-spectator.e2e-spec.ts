import request from 'supertest'
import { AvatarFactory } from 'test/factories/make-avatar'
import { SpectatorFactory } from 'test/factories/make-spectator'

import { app } from '@/infra/app'
import { BcryptHasher } from '@/infra/cryptography/bcrypt-hasher'
import { JwtEncrypter } from '@/infra/cryptography/jwt-encrypter'
import { PrismaService } from '@/infra/database/prisma'

let prisma: PrismaService
let spectatorFactory: SpectatorFactory
let bcryptHasher: BcryptHasher
let avatarFactory: AvatarFactory
let jwt: JwtEncrypter

describe('Register (E2E)', () => {
  beforeAll(async () => {
    prisma = new PrismaService()
    spectatorFactory = new SpectatorFactory(prisma)
    avatarFactory = new AvatarFactory(prisma)
    bcryptHasher = new BcryptHasher()
    jwt = new JwtEncrypter()

    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[PUT] /accounts', async () => {
    const spectator = await spectatorFactory.makePrismaSpectator({
      passwordHash: await bcryptHasher.hash('4321'),
    })
    const avatar = await avatarFactory.makePrismaAvatar()

    const accessToken = await jwt.encrypt({ sub: spectator.id.toString() })

    const spectatorId = spectator.id.toString()
    const avatarId = avatar.id.toString()

    const response = await request(app.server)
      .put('/accounts')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        avatarId,
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456',
        oldPassword: '4321',
      })

    expect(response.statusCode).toBe(204)

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        email: 'johndoe@example.com',
      },
    })

    expect(userOnDatabase).toEqual(
      expect.objectContaining({
        name: 'John Doe',
        email: 'johndoe@example.com',
      }),
    )

    const avatarOnDatabase = await prisma.avatar.findUnique({
      where: {
        id: avatarId,
      },
    })

    expect(avatarOnDatabase).toEqual(
      expect.objectContaining({
        userId: spectatorId,
      }),
    )
  })
})
