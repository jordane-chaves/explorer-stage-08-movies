import { FastifyReply, FastifyRequest } from 'fastify'
import { container } from 'tsyringe'

import { InvalidAvatarTypeError } from '@/domain/application/use-cases/errors/invalid-avatar-type-error'
import { UploadAndCreateAvatarUseCase } from '@/domain/application/use-cases/upload-and-create-avatar'

import { AvatarPresenter } from '../../presenters/avatar-presenter'

export async function uploadAvatar(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const file = await request.file({
    limits: {
      fileSize: 1000 * 1000 * 2, // 2mb
    },
  })

  if (!file) {
    return reply.status(400).send({
      message: 'Send an avatar file.',
      statusCode: 400,
    })
  }

  const uploadAvatarUseCase = container.resolve(UploadAndCreateAvatarUseCase)

  let body = null

  try {
    body = await file.toBuffer()
  } catch (error) {
    console.log(error)

    return reply.status(413).send({
      message: 'Avatar file too large',
      statusCode: 413,
    })
  }

  const result = await uploadAvatarUseCase.execute({
    fileName: file.filename,
    fileType: file.mimetype,
    body,
  })

  if (result.isLeft()) {
    const error = result.value

    switch (error.constructor) {
      case InvalidAvatarTypeError:
        return reply.status(400).send({
          message: error.message,
          statusCode: 400,
        })
      default:
        return reply.status(400).send({
          message: error.message,
          statusCode: 400,
        })
    }
  }

  const { avatar } = result.value

  return reply.status(201).send(AvatarPresenter.toHTTP(avatar))
}
