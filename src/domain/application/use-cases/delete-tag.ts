import { inject, injectable } from 'tsyringe'

import { Either, left, right } from '@/core/either'

import { TagsRepository } from '../repositories/tags-repository'
import { NotAllowedError } from './errors/not-allowed-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface DeleteTagUseCaseRequest {
  spectatorId: string
  tagId: string
}

type DeleteTagUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>

@injectable()
export class DeleteTagUseCase {
  constructor(
    @inject('TagsRepository')
    private tagsRepository: TagsRepository,
  ) {}

  async execute(
    request: DeleteTagUseCaseRequest,
  ): Promise<DeleteTagUseCaseResponse> {
    const { tagId, spectatorId } = request

    const tag = await this.tagsRepository.findById(tagId)

    if (!tag) {
      return left(new ResourceNotFoundError())
    }

    if (spectatorId !== tag.authorId.toString()) {
      return left(new NotAllowedError())
    }

    await this.tagsRepository.delete(tag)

    return right(null)
  }
}
