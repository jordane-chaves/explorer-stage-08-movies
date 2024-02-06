import { container } from 'tsyringe'

import { Eraser } from '@/domain/application/storage/eraser'
import { Uploader } from '@/domain/application/storage/uploader'
import { R2Storage } from '@/infra/storage/r2-storage'

container.registerSingleton<Uploader>('Uploader', R2Storage)
container.registerSingleton<Eraser>('Eraser', R2Storage)
