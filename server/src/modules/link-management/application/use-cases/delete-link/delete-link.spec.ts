import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  EntityValidationError,
  ResourceNotFoundError,
  UnexpectedError,
} from '@/core/application/use-cases/errors';
import { LinksFactory } from '@/test/factories';
import { InMemoryLinksRepository } from '@/test/repositories';
import { DeleteLinkUseCase } from './delete-link';

let inMemoryLinksRepository: InMemoryLinksRepository;
let linksFactory: LinksFactory;
let sut: DeleteLinkUseCase;

describe('Delete Link Use Case', () => {
  beforeEach(() => {
    inMemoryLinksRepository = new InMemoryLinksRepository();
    linksFactory = new LinksFactory(inMemoryLinksRepository);
    sut = new DeleteLinkUseCase(inMemoryLinksRepository);
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

  it('should return an UnexpectedError when repository throws on delete', async () => {
    const existingLink = await linksFactory.makeInMemoryLink();
    vi.spyOn(inMemoryLinksRepository, 'delete').mockRejectedValue(
      new Error('Database error')
    );

    const result = await sut.execute({
      shortCode: existingLink.shortCode.value,
    });

    expect(result.isFailure).toBe(true);
    expect(result.getErrorValue()).toBeInstanceOf(UnexpectedError);
    expect(inMemoryLinksRepository.items).toHaveLength(1);
  });

  it('should be able to delete an existing link', async () => {
    const existingLink = await linksFactory.makeInMemoryLink();

    const result = await sut.execute({
      shortCode: existingLink.shortCode.value,
    });

    expect(result.isSuccess).toBe(true);
    expect(inMemoryLinksRepository.items).toHaveLength(0);
  });

  it('should be able to delete an existing link when multiple links exists', async () => {
    const existingLink = await linksFactory.makeInMemoryLink();
    await linksFactory.makeMultipleInMemoryLinks(5);

    const result = await sut.execute({
      shortCode: existingLink.shortCode.value,
    });

    expect(result.isSuccess).toBe(true);
    expect(inMemoryLinksRepository.items).toHaveLength(5);
  });
});
