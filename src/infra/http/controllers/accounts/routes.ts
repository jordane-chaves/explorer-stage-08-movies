import { FastifyInstance } from 'fastify'

import { verifyJwt } from '../../middlewares/verify-jwt'
import { authenticate } from './authenticate'
import { register } from './register'
import { uploadAvatar } from './upload-avatar'

export async function accountRoutes(app: FastifyInstance) {
  app.post('/accounts', register)
  app.post('/sessions', authenticate)

  app.post('/avatar', { onRequest: verifyJwt }, uploadAvatar)
}
