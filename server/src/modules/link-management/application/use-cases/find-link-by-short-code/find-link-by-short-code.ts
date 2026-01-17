import type { UseCase } from '@/core/application/use-cases';
import {
  EntityValidationError,
  ResourceNotFoundError,
  UnexpectedError,
} from '@/core/application/use-cases/errors';
import { Result } from '@/core/shared';
import type { LinksRepository } from '@/link-management/application/repositories';
import type { Link } from '@/link-management/domain/entities';
import { ShortCode } from '@/link-management/domain/entities/value-objects';

export interface FindLinkByShortCodeUseCaseInput {
  shortCode: string;
}

export interface FindLinkByShortCodeUseCaseOutput {
  link: Link;
}

export type FindLinkByShortCodeUseCaseResult = Result<
  EntityValidationError | ResourceNotFoundError | UnexpectedError,
  FindLinkByShortCodeUseCaseOutput
>;

export class FindLinkByShortCodeUseCase
  implements
    UseCase<FindLinkByShortCodeUseCaseInput, FindLinkByShortCodeUseCaseResult>
{
  constructor(private linksRepository: LinksRepository) {}

  async execute(
    input: FindLinkByShortCodeUseCaseInput
  ): Promise<FindLinkByShortCodeUseCaseResult> {
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

      return Result.ok({ link: existingLink });
    } catch {
      return Result.fail(new UnexpectedError());
    }
  }
}
