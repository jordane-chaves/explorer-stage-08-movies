import { MovieDetails } from '@/domain/enterprise/entities/value-objects/movie-details'

import { SpectatorWithAvatarPresenter } from './spectator-with-avatar-presenter'
import { TagPresenter } from './tag-presenter'

export class MovieDetailsPresenter {
  static toHTTP(movie: MovieDetails) {
    return {
      id: movie.movieId.toString(),
      spectator_id: movie.spectatorId.toString(),
      spectator: SpectatorWithAvatarPresenter.toHTTP(movie.spectator),
      title: movie.title,
      description: movie.description,
      rating: movie.rating?.value,
      tags: movie.tags.map(TagPresenter.toHTTP),
      watched_at: movie.watchedAt,
      created_at: movie.createdAt,
      updated_at: movie.updatedAt,
    }
  }
}
