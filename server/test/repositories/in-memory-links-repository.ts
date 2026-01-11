import type { LinksRepository } from '@/link-management/application/repositories';
import type { Link } from '@/link-management/domain/entities';

export class InMemoryLinksRepository implements LinksRepository {
  public items: Link[] = [];

  async create(link: Link): Promise<void> {
    this.items.push(link);
  }

  async findByShortCode(shortCode: string): Promise<Link | null> {
    return this.items.find(link => link.shortCode.value === shortCode) || null;
  }

  async findById(id: string): Promise<Link | null> {
    return this.items.find(link => link.id.toString() === id) || null;
  }

  async findMany(): Promise<Link[]> {
    return this.items;
  }

  async delete(shortCode: string): Promise<void> {
    const itemIndex = this.items.findIndex(
      item => item.shortCode.value === shortCode
    );
    this.items.splice(itemIndex, 1);
  }

  async update(link: Link): Promise<void> {
    const itemIndex = this.items.findIndex(item => item.id.equals(link.id));
    this.items[itemIndex] = link;
  }
}
