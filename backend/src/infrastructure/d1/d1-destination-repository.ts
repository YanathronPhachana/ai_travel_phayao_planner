import type { CreateDestinationInput, Destination, DestinationCategory, UpdateDestinationInput } from '../../domain/entities/destination'
import type { DestinationRepository } from '../../domain/repositories/destination-repository'

interface DestinationRow {
  id: string
  name: string
  category: string
  description: string
  location: string
  image_url: string | null
  created_at: string
}

function toDestination(row: DestinationRow): Destination {
  return {
    id: row.id,
    name: row.name,
    category: row.category as DestinationCategory,
    description: row.description,
    location: row.location,
    imageUrl: row.image_url,
    createdAt: row.created_at,
  }
}

export class D1DestinationRepository implements DestinationRepository {
  constructor(private readonly db: D1Database) {}

  async findAll(): Promise<Destination[]> {
    const { results } = await this.db
      .prepare('SELECT id, name, category, description, location, image_url, created_at FROM destinations ORDER BY created_at DESC')
      .all<DestinationRow>()
    return results.map(toDestination)
  }

  async findById(id: string): Promise<Destination | null> {
    const row = await this.db
      .prepare('SELECT id, name, category, description, location, image_url, created_at FROM destinations WHERE id = ?')
      .bind(id)
      .first<DestinationRow>()
    return row ? toDestination(row) : null
  }

  async findByCategory(category: string): Promise<Destination[]> {
    const { results } = await this.db
      .prepare('SELECT id, name, category, description, location, image_url, created_at FROM destinations WHERE category = ? ORDER BY created_at DESC')
      .bind(category)
      .all<DestinationRow>()
    return results.map(toDestination)
  }

  async create(input: CreateDestinationInput): Promise<Destination> {
    const id = crypto.randomUUID()
    const createdAt = new Date().toISOString()
    const description = input.description ?? ''
    const location = input.location ?? ''
    const imageUrl = input.imageUrl ?? null
    await this.db
      .prepare('INSERT INTO destinations (id, name, category, description, location, image_url, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .bind(id, input.name, input.category, description, location, imageUrl, createdAt)
      .run()
    return { id, name: input.name, category: input.category, description, location, imageUrl, createdAt }
  }

  async update(id: string, input: UpdateDestinationInput): Promise<Destination | null> {
    const existing = await this.findById(id)
    if (!existing) return null

    const name = input.name ?? existing.name
    const category = input.category ?? existing.category
    const description = input.description !== undefined ? input.description : existing.description
    const location = input.location !== undefined ? input.location : existing.location
    const imageUrl = input.imageUrl !== undefined ? input.imageUrl : existing.imageUrl
    await this.db
      .prepare('UPDATE destinations SET name = ?, category = ?, description = ?, location = ?, image_url = ? WHERE id = ?')
      .bind(name, category, description, location, imageUrl, id)
      .run()
    return { ...existing, name, category, description, location, imageUrl }
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.db.prepare('DELETE FROM destinations WHERE id = ?').bind(id).run()
    return result.meta.changes > 0
  }
}
