import type { UseCase } from '@/core/application/use-cases';
import {
  EntityValidationError,
  ResourceNotFoundError,
  UnexpectedError,
} from '@/core/application/use-cases/errors';
import { Result } from '@/core/shared';
import type { LinksRepository } from '@/link-management/application/repositories';
import { ShortCode } from '@/link-management/domain/entities/value-objects';

export interface DeleteLinkUseCaseInput {
  shortCode: string;
}

export type DeleteLinkUseCaseResult = Result<
  EntityValidationError | ResourceNotFoundError | UnexpectedError,
  void
>;

export class DeleteLinkUseCase
  implements UseCase<DeleteLinkUseCaseInput, DeleteLinkUseCaseResult>
{
  constructor(private linksRepository: LinksRepository) {}

  async execute(
    input: DeleteLinkUseCaseInput
  ): Promise<DeleteLinkUseCaseResult> {
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
        return Result.fail(new ResourceNotFoundError());
      }

      await this.linksRepository.delete(existingLink.shortCode.value);
      return Result.ok();
    } catch (error) {
      console.error(error);
      return Result.fail(new UnexpectedError());
    }
  }
}
