import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Tag } from '@/domain/enterprise/entities/tag'
import { MovieDetails } from '@/domain/enterprise/entities/value-objects/movie-details'
import { Rating } from '@/domain/enterprise/entities/value-objects/rating'
import {
  Avatar as PrismaAvatar,
  Movie as PrismaMovie,
  User as PrismaUser,
  MovieTag as PrismaMovieTag,
  Tag as PrismaTag,
} from '@prisma/client'

import { PrismaSpectatorWithAvatarMapper } from './prisma-spectator-with-avatar-mapper'

type PrismaMovieDetails = PrismaMovie & {
  spectator: PrismaUser & {
    avatar: PrismaAvatar | null
  }
  tags: (PrismaMovieTag & {
    tag: PrismaTag
  })[]
}

export class PrismaMovieDetailsMapper {
  static toDomain(raw: PrismaMovieDetails): MovieDetails {
    let rating = null

    if (raw.rating) {
      const ratingResult = Rating.create(raw.rating)

      if (ratingResult.isRight()) {
        rating = ratingResult.value
      }
    }

    const tags = raw.tags.map((movieTag) => {
      const tag = movieTag.tag

      return Tag.create(
        {
          authorId: new UniqueEntityID(tag.authorId),
          name: tag.name,
        },
        new UniqueEntityID(tag.id),
      )
    })

    return MovieDetails.create({
      movieId: new UniqueEntityID(raw.id),
      spectatorId: new UniqueEntityID(raw.spectatorId),
      spectator: PrismaSpectatorWithAvatarMapper.toDomain(raw.spectator),
      title: raw.title,
      description: raw.description,
      rating,
      tags,
      watchedAt: raw.watchedAt,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    })
  }
}
