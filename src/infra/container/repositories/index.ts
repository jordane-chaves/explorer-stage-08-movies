import { container } from 'tsyringe'

import { AvatarsRepository } from '@/domain/application/repositories/avatars-repository'
import { MovieTagsRepository } from '@/domain/application/repositories/movie-tags-repository'
import { MoviesRepository } from '@/domain/application/repositories/movies-repository'
import { SpectatorAvatarsRepository } from '@/domain/application/repositories/spectator-avatars-repository'
import { SpectatorsRepository } from '@/domain/application/repositories/spectators-repository'
import { TagsRepository } from '@/domain/application/repositories/tags-repository'
import { PrismaService } from '@/infra/database/prisma'
import { PrismaAvatarsRepository } from '@/infra/database/prisma/repositories/prisma-avatars-repository'
import { PrismaMovieTagsRepository } from '@/infra/database/prisma/repositories/prisma-movie-tags-repository'
import { PrismaMoviesRepository } from '@/infra/database/prisma/repositories/prisma-movies-repository'
import { PrismaSpectatorAvatarsRepository } from '@/infra/database/prisma/repositories/prisma-spectator-avatars-repository'
import { PrismaSpectatorsRepository } from '@/infra/database/prisma/repositories/prisma-spectators-repository'
import { PrismaTagsRepository } from '@/infra/database/prisma/repositories/prisma-tags-repository'

container.registerSingleton<PrismaService>('PrismaService', PrismaService)

container.registerSingleton<SpectatorsRepository>(
  'SpectatorsRepository',
  PrismaSpectatorsRepository,
)

container.registerSingleton<SpectatorAvatarsRepository>(
  'SpectatorAvatarsRepository',
  PrismaSpectatorAvatarsRepository,
)

container.registerSingleton<MoviesRepository>(
  'MoviesRepository',
  PrismaMoviesRepository,
)

container.registerSingleton<MovieTagsRepository>(
  'MovieTagsRepository',
  PrismaMovieTagsRepository,
)

container.registerSingleton<AvatarsRepository>(
  'AvatarsRepository',
  PrismaAvatarsRepository,
)

container.registerSingleton<TagsRepository>(
  'TagsRepository',
  PrismaTagsRepository,
)
