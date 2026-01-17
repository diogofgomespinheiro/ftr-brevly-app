import { beforeEach, describe, expect, it, vi } from 'vitest';

import { UnexpectedError } from '@/core/application/use-cases/errors';
import { LinksCsvTransformer } from '@/shared/infra/services';
import { LinksFactory } from '@/test/factories';
import { FakeStorageGateway } from '@/test/gateways';
import { InMemoryLinksRepository } from '@/test/repositories';
import { ExportLinksUseCase } from './export-links';

let inMemoryLinksRepository: InMemoryLinksRepository;
let fakeStorageGateway: FakeStorageGateway;
let linksCsvTransformer: LinksCsvTransformer;
let linksFactory: LinksFactory;
let sut: ExportLinksUseCase;

describe('Export Links Use Case', () => {
  beforeEach(() => {
    inMemoryLinksRepository = new InMemoryLinksRepository();
    fakeStorageGateway = new FakeStorageGateway();
    linksCsvTransformer = new LinksCsvTransformer();
    linksFactory = new LinksFactory(inMemoryLinksRepository);
    sut = new ExportLinksUseCase(
      inMemoryLinksRepository,
      fakeStorageGateway,
      linksCsvTransformer
    );
  });

  it('should export links to CSV and return storage URL', async () => {
    await linksFactory.makeMultipleInMemoryLinks(3);

    const result = await sut.execute();

    expect(result.isSuccess).toBe(true);
    expect(result.getValue().reportUrl).toContain('https://');
    expect(result.getValue().reportUrl).toContain('exports/');
    expect(result.getValue().reportUrl).toContain('-links.csv');
  });

  it('should upload file with correct content type', async () => {
    await linksFactory.makeInMemoryLink();

    await sut.execute();

    expect(fakeStorageGateway.uploadedFiles).toHaveLength(1);
    expect(fakeStorageGateway.uploadedFiles[0].contentType).toBe('text/csv');
    expect(fakeStorageGateway.uploadedFiles[0].folder).toBe('exports');
  });

  it('should generate CSV with correct headers', async () => {
    await linksFactory.makeInMemoryLink();

    await sut.execute();

    const csvContent = fakeStorageGateway.uploadedContent[0];
    expect(csvContent).toContain('ID');
    expect(csvContent).toContain('Short Code');
    expect(csvContent).toContain('Original URL');
    expect(csvContent).toContain('Access Count');
    expect(csvContent).toContain('Created At');
    expect(csvContent).toContain('Updated At');
  });

  it('should include link data in CSV', async () => {
    const link = await linksFactory.makeInMemoryLink();

    await sut.execute();

    const csvContent = fakeStorageGateway.uploadedContent[0];
    expect(csvContent).toContain(link.id.toString());
    expect(csvContent).toContain(link.shortCode.value);
    expect(csvContent).toContain(link.originalUrl.value);
  });

  it('should export multiple links', async () => {
    await linksFactory.makeMultipleInMemoryLinks(5);

    await sut.execute();
    const csvContent = fakeStorageGateway.uploadedContent[0];
    const lines = csvContent.trim().split('\n');
    expect(lines).toHaveLength(6);
  });

  it('should export empty CSV with only headers when no links exist', async () => {
    const result = await sut.execute();
    expect(result.isSuccess).toBe(true);

    const csvContent = fakeStorageGateway.uploadedContent[0];
    const lines = csvContent.trim().split('\n');
    expect(lines).toHaveLength(1);
    expect(csvContent).toContain('ID');
  });

  it('should generate unique filename with timestamp', async () => {
    await linksFactory.makeInMemoryLink();
    await sut.execute();

    const fileName = fakeStorageGateway.uploadedFiles[0].fileName;
    expect(fileName).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z-links\.csv$/
    );
  });

  it('should return UnexpectedError when storage upload fails', async () => {
    await linksFactory.makeInMemoryLink();
    vi.spyOn(fakeStorageGateway, 'uploadStream').mockRejectedValue(
      new Error('Storage unavailable')
    );

    const result = await sut.execute();

    expect(result.isFailure).toBe(true);
    expect(result.getErrorValue()).toBeInstanceOf(UnexpectedError);
  });

  it('should return UnexpectedError when repository stream fails', async () => {
    vi.spyOn(inMemoryLinksRepository, 'createExportStream').mockImplementation(
      () => {
        throw new Error('Database connection lost');
      }
    );

    const result = await sut.execute();

    expect(result.isFailure).toBe(true);
    expect(result.getErrorValue()).toBeInstanceOf(UnexpectedError);
  });

  it('should return UnexpectedError when CSV transformation fails', async () => {
    await linksFactory.makeInMemoryLink();
    vi.spyOn(linksCsvTransformer, 'transform').mockImplementation(() => {
      throw new Error('CSV error');
    });

    const result = await sut.execute();

    expect(result.isFailure).toBe(true);
    expect(result.getErrorValue()).toBeInstanceOf(UnexpectedError);
  });
});
