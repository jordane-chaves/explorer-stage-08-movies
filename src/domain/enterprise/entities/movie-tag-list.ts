import { WatchedList } from '@/core/entities/watched-list'

import { MovieTag } from './movie-tag'

export class MovieTagList extends WatchedList<MovieTag> {
  compareItems(a: MovieTag, b: MovieTag): boolean {
    return a.tagId.equals(b.tagId) && a.movieId.equals(b.movieId)
  }
}
