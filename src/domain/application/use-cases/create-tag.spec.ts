import { makeTag } from 'test/factories/make-tag'
import { InMemoryTagsRepository } from 'test/repositories/in-memory-tags-repository'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { CreateTagUseCase } from './create-tag'

let inMemoryTagsRepository: InMemoryTagsRepository
let sut: CreateTagUseCase

describe('Create Tag', () => {
  beforeEach(() => {
    inMemoryTagsRepository = new InMemoryTagsRepository()

    sut = new CreateTagUseCase(inMemoryTagsRepository)
  })

  it('should be able to create a new tag', async () => {
    const result = await sut.execute({
      spectatorId: 'spectator-1',
      name: 'Action',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      tag: inMemoryTagsRepository.items[0],
    })
  })

  it('should return the already existing tag if created with the same name', async () => {
    const tag = makeTag({
      authorId: new UniqueEntityID('spectator-1'),
      name: 'Action',
    })

    inMemoryTagsRepository.items.push(tag)

    const result = await sut.execute({
      spectatorId: 'spectator-1',
      name: 'Action',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryTagsRepository.items).toHaveLength(1)
    expect(result.value).toEqual({
      tag: inMemoryTagsRepository.items[0],
    })
  })
})
