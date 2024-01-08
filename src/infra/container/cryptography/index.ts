import { container } from 'tsyringe'

import { Encrypter } from '@/domain/application/cryptography/encrypter'
import { HashComparer } from '@/domain/application/cryptography/hash-comparer'
import { HashGenerator } from '@/domain/application/cryptography/hash-generator'
import { BcryptHasher } from '@/infra/cryptography/bcrypt-hasher'
import { JwtEncrypter } from '@/infra/cryptography/jwt-encrypter'

container.registerSingleton<HashGenerator>('HashGenerator', BcryptHasher)
container.registerSingleton<HashComparer>('HashComparer', BcryptHasher)
container.registerSingleton<Encrypter>('Encrypter', JwtEncrypter)
