import { inject, injectable } from 'tsyringe'

import { Either, left, right } from '@/core/either'
import { Tag } from '@/domain/enterprise/entities/tag'

import { TagsRepository } from '../repositories/tags-repository'
import { NotAllowedError } from './errors/not-allowed-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface EditTagUseCaseRequest {
  spectatorId: string
  tagId: string
  name: string
}

type EditTagUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    tag: Tag
  }
>

@injectable()
export class EditTagUseCase {
  constructor(
    @inject('TagsRepository')
    private tagsRepository: TagsRepository,
  ) {}

  async execute(
    request: EditTagUseCaseRequest,
  ): Promise<EditTagUseCaseResponse> {
    const { tagId, spectatorId, name } = request

    const tag = await this.tagsRepository.findById(tagId)

    if (!tag) {
      return left(new ResourceNotFoundError())
    }

    if (spectatorId !== tag.authorId.toString()) {
      return left(new NotAllowedError())
    }

    tag.name = name

    await this.tagsRepository.save(tag)

    return right({
      tag,
    })
  }
}
