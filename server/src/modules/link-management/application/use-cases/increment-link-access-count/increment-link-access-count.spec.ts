import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  EntityValidationError,
  ResourceNotFoundError,
  UnexpectedError,
} from '@/core/application/use-cases/errors';
import { LinksFactory } from '@/test/factories';
import { InMemoryLinksRepository } from '@/test/repositories';
import { IncrementLinkAccessCountUseCase } from './increment-link-access-count';

let inMemoryLinksRepository: InMemoryLinksRepository;
let linksFactory: LinksFactory;
let sut: IncrementLinkAccessCountUseCase;

describe('Increment Link Access Count Use Case', () => {
  beforeEach(() => {
    inMemoryLinksRepository = new InMemoryLinksRepository();
    linksFactory = new LinksFactory(inMemoryLinksRepository);
    sut = new IncrementLinkAccessCountUseCase(inMemoryLinksRepository);
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

  it('should return an UnexpectedError when repository throws on update', async () => {
    const existingLink = await linksFactory.makeInMemoryLink();
    vi.spyOn(inMemoryLinksRepository, 'update').mockRejectedValue(
      new Error('Database error')
    );

    const result = await sut.execute({
      shortCode: existingLink.shortCode.value,
    });

    expect(result.isFailure).toBe(true);
    expect(result.getErrorValue()).toBeInstanceOf(UnexpectedError);
  });

  it('should be able to increment the access count', async () => {
    const existingLink = await linksFactory.makeInMemoryLink();
    const result = await sut.execute({
      shortCode: existingLink.shortCode.value,
    });

    const linkAfterResult = await inMemoryLinksRepository.findById(
      existingLink.id.toString()
    );
    expect(result.isSuccess).toBe(true);
    expect(linkAfterResult?.accessCount).toBe(1);
    expect(linkAfterResult?.updatedAt).not.toBeUndefined();
  });

  it('should be able to increment the access count more than ounce', async () => {
    const existingLink = await linksFactory.makeInMemoryLink();
    await sut.execute({
      shortCode: existingLink.shortCode.value,
    });
    await sut.execute({
      shortCode: existingLink.shortCode.value,
    });
    await sut.execute({
      shortCode: existingLink.shortCode.value,
    });

    const linkAfterResult = await inMemoryLinksRepository.findById(
      existingLink.id.toString()
    );
    expect(linkAfterResult?.accessCount).toBe(3);
  });
});
