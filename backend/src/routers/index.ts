import { Hono } from 'hono'
import type { AppEnv } from '../types'
import { createAccommodationRouter } from './accommodation-router'
import { createChatRouter } from './chat-router'
import { createDestinationRouter } from './destination-router'
import { createPackingItemRouter } from './packing-item-router'
import { createTripRouter } from './trip-router'
import { createTripExpenseRouter } from './trip-expense-router'
import { createUserRouter } from './user-router'

export function createApiRouter() {
  const api = new Hono<AppEnv>()

  api.route('/users', createUserRouter())
  api.route('/destinations', createDestinationRouter())
  api.route('/trips', createTripRouter())
  api.route('/trips/:tripId/expenses', createTripExpenseRouter())
  api.route('/trips/:tripId/accommodations', createAccommodationRouter())
  api.route('/trips/:tripId/packing', createPackingItemRouter())
  api.route('/chat', createChatRouter())

  return api
}
