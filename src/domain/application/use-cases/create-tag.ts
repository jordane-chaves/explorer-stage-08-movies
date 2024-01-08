import { inject, injectable } from 'tsyringe'

import { Either, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Tag } from '@/domain/enterprise/entities/tag'

import { TagsRepository } from '../repositories/tags-repository'

interface CreateTagUseCaseRequest {
  spectatorId: string
  name: string
}

type CreateTagUseCaseResponse = Either<
  null,
  {
    tag: Tag
  }
>

@injectable()
export class CreateTagUseCase {
  constructor(
    @inject('TagsRepository')
    private tagsRepository: TagsRepository,
  ) {}

  async execute(
    request: CreateTagUseCaseRequest,
  ): Promise<CreateTagUseCaseResponse> {
    const { spectatorId, name } = request

    const tag = Tag.create({
      authorId: new UniqueEntityID(spectatorId),
      name,
    })

    await this.tagsRepository.create(tag)

    return right({
      tag,
    })
  }
}
