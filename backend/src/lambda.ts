// AWS Lambda entrypoint (bundled by `npm run build:lambda`).
// Lambda has no D1/KV bindings, so in-memory repositories are wired in here.
// Replace with DynamoDB/RDS/ElastiCache implementations for production use.
import { handle } from 'hono/aws-lambda'
import { createApp } from './app'
import { createContainer } from './di/container'
import { MemoryAccommodationRepository } from './infrastructure/memory/memory-accommodation-repository'
import { MemoryCacheRepository } from './infrastructure/memory/memory-cache-repository'
import { MemoryDestinationRepository } from './infrastructure/memory/memory-destination-repository'
import { MemoryPackingItemRepository } from './infrastructure/memory/memory-packing-item-repository'
import { MemoryTripRepository } from './infrastructure/memory/memory-trip-repository'
import { MemoryTripExpenseRepository } from './infrastructure/memory/memory-trip-expense-repository'
import { MemoryUserRepository } from './infrastructure/memory/memory-user-repository'

const container = createContainer({
  userRepository: new MemoryUserRepository(),
  destinationRepository: new MemoryDestinationRepository(),
  tripRepository: new MemoryTripRepository(),
  tripExpenseRepository: new MemoryTripExpenseRepository(),
  accommodationRepository: new MemoryAccommodationRepository(),
  packingItemRepository: new MemoryPackingItemRepository(),
  cacheRepository: new MemoryCacheRepository(),
})

const app = createApp(() => container)

export const handler = handle(app)
