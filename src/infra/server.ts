import { app } from './app'
import { PrismaService } from './database/prisma'
import { env } from './env'

const prisma = new PrismaService()

async function bootstrap() {
  await prisma.$connect()

  await app.listen({
    port: env.PORT,
  })
}

bootstrap()
  .then(() => console.log('⚡ HTTP server running'))
  .catch((error) => console.error(error))
