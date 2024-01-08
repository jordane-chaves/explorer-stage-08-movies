import { InMemoryTagsRepository } from 'test/repositories/in-memory-tags-repository'

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
})
