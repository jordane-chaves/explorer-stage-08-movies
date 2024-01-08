import { makeTag } from 'test/factories/make-tag'
import { InMemoryTagsRepository } from 'test/repositories/in-memory-tags-repository'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { EditTagUseCase } from './edit-tag'
import { NotAllowedError } from './errors/not-allowed-error'

let inMemoryTagsRepository: InMemoryTagsRepository
let sut: EditTagUseCase

describe('Edit Tag', () => {
  beforeEach(() => {
    inMemoryTagsRepository = new InMemoryTagsRepository()

    sut = new EditTagUseCase(inMemoryTagsRepository)
  })

  it('should be able to edit a tag', async () => {
    const tagsRepositorySaveSpy = vi.spyOn(inMemoryTagsRepository, 'save')

    const tag = makeTag(
      {
        authorId: new UniqueEntityID('spectator-1'),
        name: 'Terror',
      },
      new UniqueEntityID('tag-1'),
    )

    inMemoryTagsRepository.items.push(tag)

    const result = await sut.execute({
      spectatorId: 'spectator-1',
      tagId: 'tag-1',
      name: 'Action',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryTagsRepository.items[0].name).toEqual('Action')
    expect(tagsRepositorySaveSpy).toHaveBeenCalled()
  })

  it('should not be able to edit another user tag', async () => {
    const tag = makeTag(
      {
        authorId: new UniqueEntityID('spectator-1'),
        name: 'Terror',
      },
      new UniqueEntityID('tag-1'),
    )
    inMemoryTagsRepository.items.push(tag)

    const result = await sut.execute({
      spectatorId: 'spectator-2',
      tagId: 'tag-1',
      name: 'Action',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
