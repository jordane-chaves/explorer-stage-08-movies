import { FastifyInstance } from 'fastify'

import { verifyJwt } from '../../middlewares/verify-jwt'
import { createTag } from './create-tag'
import { deleteTag } from './delete-tag'
import { editTag } from './edit-tag'
import { fetchTags } from './fetch-tags'
import { getTag } from './get-tag'

export async function tagRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.post('/tags', createTag)
  app.get('/tags', fetchTags)
  app.get('/tags/:id', getTag)
  app.put('/tags/:id', editTag)
  app.delete('/tags/:id', deleteTag)
}
