import type { CacheRepository } from '../domain/repositories/cache-repository'
import type { DestinationRepository } from '../domain/repositories/destination-repository'
import type { PackingItemRepository } from '../domain/repositories/packing-item-repository'
import type { TripRepository } from '../domain/repositories/trip-repository'
import type { TripExpenseRepository } from '../domain/repositories/trip-expense-repository'
import type { AccommodationRepository } from '../domain/repositories/accommodation-repository'
import type { UserRepository } from '../domain/repositories/user-repository'
import { AccommodationHandler } from '../handlers/accommodation-handler'
import { ChatHandler } from '../handlers/chat-handler'
import { DestinationHandler } from '../handlers/destination-handler'
import { PackingItemHandler } from '../handlers/packing-item-handler'
import { TripHandler } from '../handlers/trip-handler'
import { TripExpenseHandler } from '../handlers/trip-expense-handler'
import { UserHandler } from '../handlers/user-handler'
import { AccommodationService } from '../services/accommodation-service'
import { ChatService } from '../services/chat-service'
import { DestinationService } from '../services/destination-service'
import { PackingItemService } from '../services/packing-item-service'
import { TripService } from '../services/trip-service'
import { TripExpenseService } from '../services/trip-expense-service'
import { UserService } from '../services/user-service'

export interface Repositories {
  userRepository: UserRepository
  destinationRepository: DestinationRepository
  tripRepository: TripRepository
  tripExpenseRepository: TripExpenseRepository
  accommodationRepository: AccommodationRepository
  packingItemRepository: PackingItemRepository
  cacheRepository: CacheRepository
}

export interface Container {
  userHandler: UserHandler
  destinationHandler: DestinationHandler
  tripHandler: TripHandler
  tripExpenseHandler: TripExpenseHandler
  accommodationHandler: AccommodationHandler
  packingItemHandler: PackingItemHandler
  chatHandler: ChatHandler
}

export function createContainer(repos: Repositories): Container {
  const userService = new UserService(repos.userRepository, repos.cacheRepository)
  const destinationService = new DestinationService(repos.destinationRepository, repos.cacheRepository)
  const tripService = new TripService(repos.tripRepository, repos.cacheRepository)
  const tripExpenseService = new TripExpenseService(repos.tripRepository, repos.tripExpenseRepository)
  const accommodationService = new AccommodationService(repos.tripRepository, repos.accommodationRepository)
  const packingItemService = new PackingItemService(repos.tripRepository, repos.packingItemRepository)
  const chatService = new ChatService(
    repos.tripRepository,
    repos.tripExpenseRepository,
    repos.accommodationRepository,
    repos.packingItemRepository
  )
  return {
    userHandler: new UserHandler(userService),
    destinationHandler: new DestinationHandler(destinationService),
    tripHandler: new TripHandler(tripService),
    tripExpenseHandler: new TripExpenseHandler(tripExpenseService),
    accommodationHandler: new AccommodationHandler(accommodationService),
    packingItemHandler: new PackingItemHandler(packingItemService),
    chatHandler: new ChatHandler(chatService),
  }
}
