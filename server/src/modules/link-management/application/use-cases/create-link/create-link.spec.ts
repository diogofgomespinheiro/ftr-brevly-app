import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  ConflictError,
  EntityValidationError,
  UnexpectedError,
} from '@/core/application/use-cases/errors';
import { LinksFactory } from '@/test/factories';
import { InMemoryLinksRepository } from '@/test/repositories';
import { CreateLinkUseCase } from './create-link';

let inMemoryLinksRepository: InMemoryLinksRepository;
let linksFactory: LinksFactory;
let sut: CreateLinkUseCase;

describe('Create Link Use Case', () => {
  beforeEach(() => {
    inMemoryLinksRepository = new InMemoryLinksRepository();
    linksFactory = new LinksFactory(inMemoryLinksRepository);
    sut = new CreateLinkUseCase(inMemoryLinksRepository);
  });

  it('should create a link with valid data', async () => {
    const result = await sut.execute({
      originalUrl: 'https://example.com',
      shortCode: 'my-link',
    });

    expect(result.isSuccess).toBe(true);
    expect(inMemoryLinksRepository.items).toHaveLength(1);
  });

  it('should return EntityValidationError when originalUrl is invalid', async () => {
    const result = await sut.execute({
      originalUrl: 'invalid-url',
      shortCode: 'my-link',
    });

    expect(result.isFailure).toBe(true);
    expect(result.getErrorValue()).toBeInstanceOf(EntityValidationError);
    expect(inMemoryLinksRepository.items).toHaveLength(0);
  });

  it('should return EntityValidationError when shortCode is invalid', async () => {
    const result = await sut.execute({
      originalUrl: 'https://example.com',
      shortCode: 'ab',
    });

    expect(result.isFailure).toBe(true);
    expect(result.getErrorValue()).toBeInstanceOf(EntityValidationError);
    expect(inMemoryLinksRepository.items).toHaveLength(0);
  });

  it('should return EntityValidationError when both originalUrl and shortCode are invalid', async () => {
    const result = await sut.execute({
      originalUrl: 'invalid-url',
      shortCode: 'ab',
    });

    expect(result.isFailure).toBe(true);
    expect(result.getErrorValue()).toBeInstanceOf(EntityValidationError);
    expect(inMemoryLinksRepository.items).toHaveLength(0);
  });

  it('should return ConflictError when short code already exists', async () => {
    const existingLink = await linksFactory.makeInMemoryLink();
    const result = await sut.execute({
      originalUrl: 'https://example.com',
      shortCode: existingLink.shortCode.value,
    });

    expect(result.isFailure).toBe(true);
    expect(result.getErrorValue()).toBeInstanceOf(ConflictError);
    expect(result.getErrorValue().cause).toBe(
      `Link with short code ${existingLink.shortCode.value} already exists`
    );
    expect(inMemoryLinksRepository.items).toHaveLength(1);
  });

  it('should return UnexpectedError when repository throws on findByShortCode', async () => {
    vi.spyOn(inMemoryLinksRepository, 'findByShortCode').mockRejectedValue(
      new Error('Database error')
    );

    const result = await sut.execute({
      originalUrl: 'https://example.com',
      shortCode: 'my-link',
    });

    expect(result.isFailure).toBe(true);
    expect(result.getErrorValue()).toBeInstanceOf(UnexpectedError);
    expect(inMemoryLinksRepository.items).toHaveLength(0);
  });

  it('should return UnexpectedError when repository throws on create', async () => {
    vi.spyOn(inMemoryLinksRepository, 'create').mockRejectedValue(
      new Error('Database error')
    );

    const result = await sut.execute({
      originalUrl: 'https://example.com',
      shortCode: 'my-link',
    });

    expect(result.isFailure).toBe(true);
    expect(result.getErrorValue()).toBeInstanceOf(UnexpectedError);
    expect(inMemoryLinksRepository.items).toHaveLength(0);
  });
});
