import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  EntityValidationError,
  ResourceNotFoundError,
  UnexpectedError,
} from '@/core/application/use-cases/errors';
import { LinksFactory } from '@/test/factories';
import { InMemoryLinksRepository } from '@/test/repositories';
import { FindLinkByShortCodeUseCase } from './find-link-by-short-code';

let inMemoryLinksRepository: InMemoryLinksRepository;
let linksFactory: LinksFactory;
let sut: FindLinkByShortCodeUseCase;

describe('Find Link By Short Code Use Case', () => {
  beforeEach(() => {
    inMemoryLinksRepository = new InMemoryLinksRepository();
    linksFactory = new LinksFactory(inMemoryLinksRepository);
    sut = new FindLinkByShortCodeUseCase(inMemoryLinksRepository);
  });

  it('should return an EntityValidationError if the short code is not valid', async () => {
    const result = await sut.execute({
      shortCode: 'my',
    });

    expect(result.isFailure).toBe(true);
    expect(result.getErrorValue()).toBeInstanceOf(EntityValidationError);
  });

  it('should return a ResourceNotFoundError if the link does not exist', async () => {
    const result = await sut.execute({
      shortCode: 'my-link',
    });

    expect(result.isFailure).toBe(true);
    expect(result.getErrorValue()).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should return an UnexpectedError when repository throws on findByShortCode', async () => {
    vi.spyOn(inMemoryLinksRepository, 'findByShortCode').mockRejectedValue(
      new Error('Database error')
    );

    const result = await sut.execute({
      shortCode: 'my-link',
    });

    expect(result.isFailure).toBe(true);
    expect(result.getErrorValue()).toBeInstanceOf(UnexpectedError);
  });

  it('should be able to find an existing link', async () => {
    const existingLink = await linksFactory.makeInMemoryLink();

    const result = await sut.execute({
      shortCode: existingLink.shortCode.value,
    });

    expect(result.isSuccess).toBe(true);
    expect(result.getValue().link.id.toString()).toBe(
      existingLink.id.toString()
    );
  });

  it('should be able to find an existing link when multiple links exist', async () => {
    const existingLink = await linksFactory.makeInMemoryLink();
    await linksFactory.makeMultipleInMemoryLinks(5);

    const result = await sut.execute({
      shortCode: existingLink.shortCode.value,
    });

    expect(result.isSuccess).toBe(true);
    expect(result.getValue().link.id.toString()).toBe(
      existingLink.id.toString()
    );
  });
});
