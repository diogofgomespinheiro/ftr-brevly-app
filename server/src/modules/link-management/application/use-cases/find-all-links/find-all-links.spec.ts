import { beforeEach, describe, expect, it, vi } from 'vitest';

import { UnexpectedError } from '@/core/application/use-cases/errors';
import { LinksFactory } from '@/test/factories';
import { InMemoryLinksRepository } from '@/test/repositories';
import { FindAllLinksUseCase } from './find-all-links';

let inMemoryLinksRepository: InMemoryLinksRepository;
let linksFactory: LinksFactory;
let sut: FindAllLinksUseCase;

describe('Find All Links Use Case', () => {
  beforeEach(() => {
    inMemoryLinksRepository = new InMemoryLinksRepository();
    linksFactory = new LinksFactory(inMemoryLinksRepository);
    sut = new FindAllLinksUseCase(inMemoryLinksRepository);
  });

  it('should return an UnexpectedError when repository throws on findMany', async () => {
    vi.spyOn(inMemoryLinksRepository, 'findMany').mockRejectedValue(
      new Error('Database error')
    );

    const result = await sut.execute();
    expect(result.isFailure).toBe(true);
    expect(result.getErrorValue()).toBeInstanceOf(UnexpectedError);
  });

  it('should return an empty array if there are no links', async () => {
    const result = await sut.execute();
    expect(result.isSuccess).toBe(true);
    expect(result.getValue().links).toHaveLength(0);
  });

  it('should be able to find existing links', async () => {
    await linksFactory.makeMultipleInMemoryLinks(5);

    const result = await sut.execute();
    expect(result.isSuccess).toBe(true);
    expect(result.getValue().links).toHaveLength(5);
  });
});
