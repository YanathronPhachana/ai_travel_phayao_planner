import type { CreatePackingItemInput, PackingItem, UpdatePackingItemInput } from '../../domain/entities/packing-item'
import type { PackingItemRepository } from '../../domain/repositories/packing-item-repository'

export class MemoryPackingItemRepository implements PackingItemRepository {
  private readonly items = new Map<string, PackingItem>()

  async findByTripId(tripId: string): Promise<PackingItem[]> {
    return [...this.items.values()]
      .filter((i) => i.tripId === tripId)
      .sort((a, b) => a.category.localeCompare(b.category) || b.createdAt.localeCompare(a.createdAt))
  }

  async findById(id: string): Promise<PackingItem | null> {
    return this.items.get(id) ?? null
  }

  async create(input: CreatePackingItemInput): Promise<PackingItem> {
    const item: PackingItem = {
      id: crypto.randomUUID(),
      tripId: input.tripId,
      category: input.category,
      itemName: input.itemName,
      quantity: input.quantity ?? null,
      isChecked: false,
      notes: input.notes ?? '',
      createdAt: new Date().toISOString(),
    }
    this.items.set(item.id, item)
    return item
  }

  async update(id: string, input: UpdatePackingItemInput): Promise<PackingItem | null> {
    const existing = this.items.get(id)
    if (!existing) return null
    const updated: PackingItem = {
      ...existing,
      category: input.category ?? existing.category,
      itemName: input.itemName ?? existing.itemName,
      quantity: input.quantity !== undefined ? input.quantity : existing.quantity,
      isChecked: input.isChecked !== undefined ? input.isChecked : existing.isChecked,
      notes: input.notes !== undefined ? input.notes : existing.notes,
    }
    this.items.set(id, updated)
    return updated
  }

  async delete(id: string): Promise<boolean> {
    return this.items.delete(id)
  }
}
