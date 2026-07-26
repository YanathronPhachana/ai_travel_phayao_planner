// Cloudflare Workers entrypoint (referenced by wrangler.jsonc "main").
// Wires D1 + KV implementations into the runtime-agnostic app.
import { createApp } from './app'
import { createContainer } from './di/container'
import { D1AccommodationRepository } from './infrastructure/d1/d1-accommodation-repository'
import { D1DestinationRepository } from './infrastructure/d1/d1-destination-repository'
import { D1PackingItemRepository } from './infrastructure/d1/d1-packing-item-repository'
import { D1TripRepository } from './infrastructure/d1/d1-trip-repository'
import { D1TripExpenseRepository } from './infrastructure/d1/d1-trip-expense-repository'
import { D1UserRepository } from './infrastructure/d1/d1-user-repository'
import { GeminiClient } from './infrastructure/gemini/gemini-client'
import { KVCacheRepository } from './infrastructure/kv/kv-cache-repository'
import type { Bindings } from './types'

const app = createApp((env) => {
  const bindings = env as Bindings
  return createContainer(
    {
      userRepository: new D1UserRepository(bindings.DB),
      destinationRepository: new D1DestinationRepository(bindings.DB),
      tripRepository: new D1TripRepository(bindings.DB),
      tripExpenseRepository: new D1TripExpenseRepository(bindings.DB),
      accommodationRepository: new D1AccommodationRepository(bindings.DB),
      packingItemRepository: new D1PackingItemRepository(bindings.DB),
      cacheRepository: new KVCacheRepository(bindings.KV),
    },
    new GeminiClient(bindings.GEMINI_API_KEY)
  )
})

export default app
