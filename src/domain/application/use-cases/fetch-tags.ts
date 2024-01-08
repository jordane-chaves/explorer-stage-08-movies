import { inject, injectable } from 'tsyringe'

import { Either, right } from '@/core/either'
import { Tag } from '@/domain/enterprise/entities/tag'

import { TagsRepository } from '../repositories/tags-repository'

interface FetchTagsUseCaseRequest {
  spectatorId: string
  page: number
  perPage: number
}

type FetchTagsUseCaseResponse = Either<
  null,
  {
    tags: Tag[]
  }
>

@injectable()
export class FetchTagsUseCase {
  constructor(
    @inject('TagsRepository')
    private tagsRepository: TagsRepository,
  ) {}

  async execute(
    request: FetchTagsUseCaseRequest,
  ): Promise<FetchTagsUseCaseResponse> {
    const { spectatorId, page, perPage } = request

    const tags = await this.tagsRepository.findManyByAuthorId(spectatorId, {
      page,
      perPage,
    })

    return right({
      tags,
    })
  }
}
