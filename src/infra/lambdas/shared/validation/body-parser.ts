import { z } from 'zod'
import { extractSchemaError } from './extract-schema-error'
import { InvalidPayloadError } from '@/core/errors/invalid-payload-error'

export function parseBody<T>(schema: z.ZodSchema<T>, body?: string): T {
  let parsedBody = null

  try {
    parsedBody = JSON.parse(body)
  } catch {
    const err = 'Invalid payload format'
    throw new InvalidPayloadError(err)
  }

  const { success, data, error } = schema.safeParse(parsedBody)

  if (!success) {
    const err = extractSchemaError(error.issues)
    throw new InvalidPayloadError(err)
  }

  return data
}
