import type { UseCase } from '@/core/application/use-cases';
import {
  ConflictError,
  EntityValidationError,
  UnexpectedError,
} from '@/core/application/use-cases/errors';
import { Result } from '@/core/shared';
import type { LinksRepository } from '@/link-management/application/repositories';
import { Link } from '@/link-management/domain/entities';
import {
  OriginalUrl,
  ShortCode,
} from '@/link-management/domain/entities/value-objects';

export interface CreateLinkUseCaseInput {
  originalUrl: string;
  shortCode: string;
}

export type CreateLinkUseCaseResult = Result<
  EntityValidationError | ConflictError | UnexpectedError,
  void
>;

export class CreateLinkUseCase
  implements UseCase<CreateLinkUseCaseInput, CreateLinkUseCaseResult>
{
  constructor(private linksRepository: LinksRepository) {}

  async execute(
    input: CreateLinkUseCaseInput
  ): Promise<CreateLinkUseCaseResult> {
    try {
      const originalUrl = OriginalUrl.create(input.originalUrl);
      const shortCode = ShortCode.create(input.shortCode);
      const attributesValidation = Result.combine([originalUrl, shortCode]);

      if (attributesValidation.isFailure) {
        return Result.fail(
          new EntityValidationError(
            attributesValidation.getErrorValue().message
          )
        );
      }

      const existingLink = await this.linksRepository.findByShortCode(
        shortCode.getValue().value
      );
      if (existingLink) {
        return Result.fail(
          new ConflictError(
            `Link with short code ${shortCode.getValue().value} already exists`
          )
        );
      }

      await this.linksRepository.create(
        Link.create({
          originalUrl: originalUrl.getValue(),
          shortCode: shortCode.getValue(),
        })
      );

      return Result.ok();
    } catch {
      return Result.fail(new UnexpectedError());
    }
  }
}
