import { inject, injectable } from 'tsyringe'

import { Either, left, right } from '@/core/either'
import { Tag } from '@/domain/enterprise/entities/tag'

import { TagsRepository } from '../repositories/tags-repository'
import { NotAllowedError } from './errors/not-allowed-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface GetTagUseCaseRequest {
  spectatorId: string
  tagId: string
}

type GetTagUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    tag: Tag
  }
>

@injectable()
export class GetTagUseCase {
  constructor(
    @inject('TagsRepository')
    private tagsRepository: TagsRepository,
  ) {}

  async execute(request: GetTagUseCaseRequest): Promise<GetTagUseCaseResponse> {
    const { tagId, spectatorId } = request

    const tag = await this.tagsRepository.findById(tagId)

    if (!tag) {
      return left(new ResourceNotFoundError())
    }

    if (spectatorId !== tag.authorId.toString()) {
      return left(new NotAllowedError())
    }

    return right({
      tag,
    })
  }
}
