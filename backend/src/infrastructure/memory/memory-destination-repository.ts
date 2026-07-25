import type { CreateDestinationInput, Destination, UpdateDestinationInput } from '../../domain/entities/destination'
import type { DestinationRepository } from '../../domain/repositories/destination-repository'

export class MemoryDestinationRepository implements DestinationRepository {
  private readonly destinations = new Map<string, Destination>()

  async findAll(): Promise<Destination[]> {
    return [...this.destinations.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }

  async findById(id: string): Promise<Destination | null> {
    return this.destinations.get(id) ?? null
  }

  async findByCategory(category: string): Promise<Destination[]> {
    return [...this.destinations.values()]
      .filter((d) => d.category === category)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }

  async create(input: CreateDestinationInput): Promise<Destination> {
    const destination: Destination = {
      id: crypto.randomUUID(),
      name: input.name,
      category: input.category,
      description: input.description ?? '',
      location: input.location ?? '',
      imageUrl: input.imageUrl ?? null,
      createdAt: new Date().toISOString(),
    }
    this.destinations.set(destination.id, destination)
    return destination
  }

  async update(id: string, input: UpdateDestinationInput): Promise<Destination | null> {
    const existing = this.destinations.get(id)
    if (!existing) return null
    const updated: Destination = {
      ...existing,
      name: input.name ?? existing.name,
      category: input.category ?? existing.category,
      description: input.description !== undefined ? input.description : existing.description,
      location: input.location !== undefined ? input.location : existing.location,
      imageUrl: input.imageUrl !== undefined ? input.imageUrl : existing.imageUrl,
    }
    this.destinations.set(id, updated)
    return updated
  }

  async delete(id: string): Promise<boolean> {
    return this.destinations.delete(id)
  }
}
