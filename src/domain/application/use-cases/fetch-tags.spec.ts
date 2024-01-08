import { makeTag } from 'test/factories/make-tag'
import { InMemoryTagsRepository } from 'test/repositories/in-memory-tags-repository'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { FetchTagsUseCase } from './fetch-tags'

let inMemoryTagsRepository: InMemoryTagsRepository
let sut: FetchTagsUseCase

describe('Fetch Tags', () => {
  beforeEach(() => {
    inMemoryTagsRepository = new InMemoryTagsRepository()

    sut = new FetchTagsUseCase(inMemoryTagsRepository)
  })

  it('should be able to fetch spectator tags', async () => {
    inMemoryTagsRepository.items.push(
      makeTag({ authorId: new UniqueEntityID('spectator-1') }),
      makeTag({ authorId: new UniqueEntityID('spectator-1') }),
      makeTag({ authorId: new UniqueEntityID('spectator-1') }),
    )

    const result = await sut.execute({
      spectatorId: 'spectator-1',
      page: 1,
      perPage: 20,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      tags: [
        expect.objectContaining({
          authorId: new UniqueEntityID('spectator-1'),
        }),
        expect.objectContaining({
          authorId: new UniqueEntityID('spectator-1'),
        }),
        expect.objectContaining({
          authorId: new UniqueEntityID('spectator-1'),
        }),
      ],
    })
  })

  it('should fetch paginated spectator tags', async () => {
    for (let i = 1; i <= 22; i++) {
      inMemoryTagsRepository.items.push(
        makeTag({ authorId: new UniqueEntityID('spectator-1') }),
      )
    }

    const result = await sut.execute({
      spectatorId: 'spectator-1',
      page: 2,
      perPage: 20,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.tags).toHaveLength(2)
  })
})
