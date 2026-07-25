import type { CreatePackingItemInput, PackingCategory, PackingItem, UpdatePackingItemInput } from '../../domain/entities/packing-item'
import type { PackingItemRepository } from '../../domain/repositories/packing-item-repository'

interface PackingItemRow {
  id: string
  trip_id: string
  category: string
  item_name: string
  quantity: number | null
  is_checked: number
  notes: string
  created_at: string
}

function toPackingItem(row: PackingItemRow): PackingItem {
  return {
    id: row.id,
    tripId: row.trip_id,
    category: row.category as PackingCategory,
    itemName: row.item_name,
    quantity: row.quantity,
    isChecked: Boolean(row.is_checked),
    notes: row.notes,
    createdAt: row.created_at,
  }
}

export class D1PackingItemRepository implements PackingItemRepository {
  constructor(private readonly db: D1Database) {}

  async findByTripId(tripId: string): Promise<PackingItem[]> {
    const { results } = await this.db
      .prepare('SELECT id, trip_id, category, item_name, quantity, is_checked, notes, created_at FROM packing_items WHERE trip_id = ? ORDER BY category, created_at DESC')
      .bind(tripId)
      .all<PackingItemRow>()
    return results.map(toPackingItem)
  }

  async findById(id: string): Promise<PackingItem | null> {
    const row = await this.db
      .prepare('SELECT id, trip_id, category, item_name, quantity, is_checked, notes, created_at FROM packing_items WHERE id = ?')
      .bind(id)
      .first<PackingItemRow>()
    return row ? toPackingItem(row) : null
  }

  async create(input: CreatePackingItemInput): Promise<PackingItem> {
    const id = crypto.randomUUID()
    const createdAt = new Date().toISOString()
    const quantity = input.quantity ?? null
    const notes = input.notes ?? ''
    await this.db
      .prepare('INSERT INTO packing_items (id, trip_id, category, item_name, quantity, is_checked, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
      .bind(id, input.tripId, input.category, input.itemName, quantity, 0, notes, createdAt)
      .run()
    return { id, tripId: input.tripId, category: input.category, itemName: input.itemName, quantity, isChecked: false, notes, createdAt }
  }

  async update(id: string, input: UpdatePackingItemInput): Promise<PackingItem | null> {
    const existing = await this.findById(id)
    if (!existing) return null

    const category = input.category ?? existing.category
    const itemName = input.itemName ?? existing.itemName
    const quantity = input.quantity !== undefined ? input.quantity : existing.quantity
    const isChecked = input.isChecked !== undefined ? input.isChecked : existing.isChecked
    const notes = input.notes !== undefined ? input.notes : existing.notes
    await this.db
      .prepare('UPDATE packing_items SET category = ?, item_name = ?, quantity = ?, is_checked = ?, notes = ? WHERE id = ?')
      .bind(category, itemName, quantity, isChecked ? 1 : 0, notes, id)
      .run()
    return { ...existing, category, itemName, quantity, isChecked, notes }
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.db.prepare('DELETE FROM packing_items WHERE id = ?').bind(id).run()
    return result.meta.changes > 0
  }
}
