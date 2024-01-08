import { makeTag } from 'test/factories/make-tag'
import { InMemoryTagsRepository } from 'test/repositories/in-memory-tags-repository'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { NotAllowedError } from './errors/not-allowed-error'
import { GetTagUseCase } from './get-tag'

let inMemoryTagsRepository: InMemoryTagsRepository
let sut: GetTagUseCase

describe('Get Tag', () => {
  beforeEach(() => {
    inMemoryTagsRepository = new InMemoryTagsRepository()

    sut = new GetTagUseCase(inMemoryTagsRepository)
  })

  it('should be able to get a tag', async () => {
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
    expect(result.value).toEqual({
      tag: inMemoryTagsRepository.items[0],
    })
  })

  it('should not be able to get another user tag', async () => {
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
