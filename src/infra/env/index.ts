import { config } from 'dotenv'
import { expand } from 'dotenv-expand'
import { z } from 'zod'

expand(config({ path: '.env' }))

if (process.env.NODE_ENV === 'test') {
  expand(config({ path: '.env.test', override: true }))
}

export const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  DATABASE_URL: z.string().url(),
  JWT_PRIVATE_KEY: z.string(),
  JWT_PUBLIC_KEY: z.string(),
  CLOUDFLARE_ACCOUNT_ID: z.string(),
  AWS_BUCKET_NAME: z.string(),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  AWS_BUCKET_PUBLIC_URL: z.string().url(),
  HOST: z.string().ip().optional().default('0.0.0.0'),
  PORT: z.coerce.number().optional().default(3333),
})

const envParsed = envSchema.safeParse(process.env)

if (envParsed.success === false) {
  console.error('⚠️ Invalid environment variables.', envParsed.error.format())

  throw new Error('⚠️ Invalid environment variables.')
}

export const env = envParsed.data
