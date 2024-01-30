import { FastifyInstance } from 'fastify'

import { verifyJwt } from '../../middlewares/verify-jwt'
import { authenticate } from './authenticate'
import { editSpectator } from './edit-spectator'
import { register } from './register'
import { uploadAvatar } from './upload-avatar'

export async function accountRoutes(app: FastifyInstance) {
  app.post('/sessions', authenticate)
  app.post('/accounts', register)

  app.put('/accounts', { onRequest: verifyJwt }, editSpectator)
  app.post('/avatar', { onRequest: verifyJwt }, uploadAvatar)
}
