import { faker } from '@faker-js/faker';

import type { UniqueEntityID } from '@/core/domain';
import type { LinksRepository } from '@/link-management/application/repositories';
import { Link, type LinkProps } from '@/link-management/domain/entities';
import {
  OriginalUrl,
  ShortCode,
} from '@/link-management/domain/entities/value-objects';

export function makeLink(
  overrides: Partial<LinkProps> = {},
  id?: UniqueEntityID
): Link {
  const originalUrl = OriginalUrl.create(faker.internet.url()).getValue();
  const shortCode = ShortCode.create(
    faker.string.alphanumeric({ length: { min: 4, max: 12 } })
  ).getValue();

  return Link.create(
    {
      originalUrl,
      shortCode,
      ...overrides,
    },
    id
  );
}

export class LinksFactory {
  constructor(private inMemoryRepository: LinksRepository) {}

  async makeInMemoryLink(
    data?: Partial<LinkProps>,
    id?: UniqueEntityID
  ): Promise<Link> {
    const link = makeLink({ ...data }, id);
    await this.inMemoryRepository.create(link);

    return link;
  }

  async makeMultipleInMemoryLinks(quantity: number) {
    for (let i = 1; i <= quantity; i++) {
      await this.makeInMemoryLink();
    }
  }
}
