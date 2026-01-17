import type { Link } from '@/link-management/domain/entities';

export interface LinksRepository {
  create(link: Link): Promise<void>;
  findByShortCode(shortCode: string): Promise<Link | null>;
  findById(id: string): Promise<Link | null>;
  findMany(): Promise<Link[]>;
  delete(shortCode: string): Promise<void>;
  update(link: Link): Promise<void>;
  createExportStream(): AsyncIterable<Link>;
}
