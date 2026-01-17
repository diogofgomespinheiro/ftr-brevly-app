import type { Link } from '@/link-management/domain/entities';

export class LinkPresenter {
  static toHTTP(link: Link) {
    return {
      id: link.id.toString(),
      original_url: link.originalUrl.value,
      short_code: link.shortCode.value,
      access_count: link.accessCount,
      created_at: link.createdAt.toISOString(),
      updated_at: link.updatedAt?.toISOString(),
    };
  }

  static toHTTPList(links: Link[]) {
    return links.map(LinkPresenter.toHTTP);
  }
}
