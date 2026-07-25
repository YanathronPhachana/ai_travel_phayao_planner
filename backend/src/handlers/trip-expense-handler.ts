import type { Context } from 'hono'
import type { CreateTripExpenseInput, UpdateTripExpenseInput } from '../domain/entities/trip-expense'
import { ValidationError } from '../domain/errors'
import type { TripExpenseService } from '../services/trip-expense-service'

export class TripExpenseHandler {
  constructor(private readonly expenseService: TripExpenseService) {}

  list = async (c: Context) => {
    const expenses = await this.expenseService.listExpenses(this.param(c, 'tripId'))
    return c.json({ data: expenses })
  }

  get = async (c: Context) => {
    const expense = await this.expenseService.getExpense(this.param(c, 'tripId'), this.param(c, 'id'))
    return c.json({ data: expense })
  }

  create = async (c: Context) => {
    const body = await this.parseJson<CreateTripExpenseInput>(c)
    const expense = await this.expenseService.createExpense(this.param(c, 'tripId'), body)
    return c.json({ data: expense }, 201)
  }

  update = async (c: Context) => {
    const body = await this.parseJson<UpdateTripExpenseInput>(c)
    const expense = await this.expenseService.updateExpense(this.param(c, 'tripId'), this.param(c, 'id'), body)
    return c.json({ data: expense })
  }

  delete = async (c: Context) => {
    await this.expenseService.deleteExpense(this.param(c, 'tripId'), this.param(c, 'id'))
    return c.body(null, 204)
  }

  summary = async (c: Context) => {
    const summary = await this.expenseService.getSummary(this.param(c, 'tripId'))
    return c.json({ data: summary })
  }

  private param(c: Context, name: string): string {
    const value = c.req.param(name)
    if (!value) throw new ValidationError(`${name} param is required`)
    return value
  }

  private async parseJson<T>(c: Context): Promise<T> {
    try {
      return await c.req.json<T>()
    } catch {
      throw new ValidationError('Invalid JSON body')
    }
  }
}
