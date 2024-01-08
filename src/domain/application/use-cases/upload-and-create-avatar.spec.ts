import { InMemoryAvatarsRepository } from 'test/repositories/in-memory-avatars-repository'
import { FakeUploader } from 'test/storage/fake-uploader'

import { InvalidAvatarTypeError } from './errors/invalid-avatar-type-error'
import { UploadAndCreateAvatarUseCase } from './upload-and-create-avatar'

let inMemoryAvatarsRepository: InMemoryAvatarsRepository
let fakeUploader: FakeUploader

let sut: UploadAndCreateAvatarUseCase

describe('Upload and Create Avatar', () => {
  beforeEach(() => {
    inMemoryAvatarsRepository = new InMemoryAvatarsRepository()

    fakeUploader = new FakeUploader()

    sut = new UploadAndCreateAvatarUseCase(
      inMemoryAvatarsRepository,
      fakeUploader,
    )
  })

  it('should be able to upload an avatar', async () => {
    const result = await sut.execute({
      fileName: 'profile.png',
      fileType: 'image/png',
      body: Buffer.from(''),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      avatar: inMemoryAvatarsRepository.items[0],
    })

    expect(fakeUploader.uploads).toHaveLength(1)
    expect(fakeUploader.uploads[0]).toEqual(
      expect.objectContaining({
        fileName: 'profile.png',
      }),
    )
  })

  it('should not be able to upload an avatar with invalid file type', async () => {
    const result = await sut.execute({
      fileName: 'audio.mp3',
      fileType: 'image/mpeg',
      body: Buffer.from(''),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidAvatarTypeError)
  })
})
