import type { UseCase } from '@/core/application/use-cases';
import {
  EntityValidationError,
  ResourceNotFoundError,
  UnexpectedError,
} from '@/core/application/use-cases/errors';
import { Result } from '@/core/shared';
import type { LinksRepository } from '@/link-management/application/repositories';
import { ShortCode } from '@/link-management/domain/entities/value-objects';

export interface IncrementLinkAccessCountUseCaseInput {
  shortCode: string;
}

export type IncrementLinkAccessCountUseCaseResult = Result<
  EntityValidationError | ResourceNotFoundError | UnexpectedError,
  void
>;

export class IncrementLinkAccessCountUseCase
  implements
    UseCase<
      IncrementLinkAccessCountUseCaseInput,
      IncrementLinkAccessCountUseCaseResult
    >
{
  constructor(private linksRepository: LinksRepository) {}

  async execute(
    input: IncrementLinkAccessCountUseCaseInput
  ): Promise<IncrementLinkAccessCountUseCaseResult> {
    try {
      const shortCode = ShortCode.create(input.shortCode);

      if (shortCode.isFailure) {
        return Result.fail(
          new EntityValidationError(shortCode.getErrorValue().message)
        );
      }

      const existingLink = await this.linksRepository.findByShortCode(
        shortCode.getValue().value
      );
      if (!existingLink) {
        return Result.fail(
          new ResourceNotFoundError(
            `Link with short code "${input.shortCode}" does not exist`
          )
        );
      }

      existingLink.incrementAccessCount();
      await this.linksRepository.update(existingLink);

      return Result.ok();
    } catch {
      return Result.fail(new UnexpectedError());
    }
  }
}
