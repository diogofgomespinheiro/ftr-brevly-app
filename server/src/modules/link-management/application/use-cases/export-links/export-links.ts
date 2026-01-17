import type { UseCase } from '@/core/application/use-cases';
import { UnexpectedError } from '@/core/application/use-cases/errors';
import { Result } from '@/core/shared';
import type { StorageGateway } from '@/link-management/application/gateways';
import type { LinksRepository } from '@/link-management/application/repositories';
import type { CsvTransformerService } from '@/link-management/application/services';

export interface ExportLinksUseCaseOutput {
  reportUrl: string;
}

export type ExportLinksUseCaseResult = Result<
  UnexpectedError,
  ExportLinksUseCaseOutput
>;

export class ExportLinksUseCase
  implements UseCase<void, ExportLinksUseCaseResult>
{
  constructor(
    private linksRepository: LinksRepository,
    private storageGateway: StorageGateway,
    private csvTransformer: CsvTransformerService
  ) {}

  async execute(): Promise<ExportLinksUseCaseResult> {
    try {
      const linksStream = this.linksRepository.createExportStream();
      const csvStream = this.csvTransformer.transform(linksStream);

      const result = await this.storageGateway.uploadStream({
        contentStream: csvStream,
        contentType: 'text/csv',
        folder: 'exports',
        fileName: `${new Date().toISOString()}-links.csv`,
      });

      return Result.ok({ reportUrl: result.url });
    } catch {
      return Result.fail(new UnexpectedError());
    }
  }
}
