import { makeTag } from 'test/factories/make-tag'
import { InMemoryTagsRepository } from 'test/repositories/in-memory-tags-repository'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { DeleteTagUseCase } from './delete-tag'
import { NotAllowedError } from './errors/not-allowed-error'

let inMemoryTagsRepository: InMemoryTagsRepository
let sut: DeleteTagUseCase

describe('Delete Tag', () => {
  beforeEach(() => {
    inMemoryTagsRepository = new InMemoryTagsRepository()

    sut = new DeleteTagUseCase(inMemoryTagsRepository)
  })

  it('should be able to delete a tag', async () => {
    const tag = makeTag(
      {
        authorId: new UniqueEntityID('spectator-1'),
      },
      new UniqueEntityID('tag-1'),
    )
    inMemoryTagsRepository.items.push(tag)

    const result = await sut.execute({
      spectatorId: 'spectator-1',
      tagId: 'tag-1',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryTagsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete another user tag', async () => {
    const tag = makeTag(
      {
        authorId: new UniqueEntityID('spectator-1'),
      },
      new UniqueEntityID('tag-1'),
    )
    inMemoryTagsRepository.items.push(tag)

    const result = await sut.execute({
      spectatorId: 'spectator-2',
      tagId: 'tag-1',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
