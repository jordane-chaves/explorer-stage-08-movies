import { FastifyInstance } from 'fastify'

import { verifyJwt } from '../../middlewares/verify-jwt'
import { createMovie } from './create-movie'
import { deleteMovie } from './delete-movie'
import { editMovie } from './edit-movie'
import { fetchMovies } from './fetch-movies'
import { getMovie } from './get-movie'

export async function movieRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.post('/movies', createMovie)
  app.get('/movies', fetchMovies)
  app.get('/movies/:id', getMovie)
  app.put('/movies/:id', editMovie)
  app.delete('/movies/:id', deleteMovie)
}
