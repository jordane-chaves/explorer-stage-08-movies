import { Movie } from '@/domain/enterprise/entities/movie'

export class MoviePresenter {
  static toHTTP(movie: Movie) {
    return {
      id: movie.id.toString(),
      spectatorId: movie.spectatorId.toString(),
      title: movie.title,
      description: movie.description,
      rating: movie.rating?.value,
      watchedAt: movie.watchedAt,
      createdAt: movie.createdAt,
      updatedAt: movie.updatedAt,
    }
  }
}
