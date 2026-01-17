import type { UseCase } from '@/core/application/use-cases';
import {
  type EntityValidationError,
  type ResourceNotFoundError,
  UnexpectedError,
} from '@/core/application/use-cases/errors';
import { Result } from '@/core/shared';
import type { LinksRepository } from '@/link-management/application/repositories';
import type { Link } from '@/link-management/domain/entities';

export interface FindAllLinksUseCaseOutput {
  links: Link[];
}

export type FindAllLinksUseCaseResult = Result<
  EntityValidationError | ResourceNotFoundError | UnexpectedError,
  FindAllLinksUseCaseOutput
>;

export class FindAllLinksUseCase
  implements UseCase<void, FindAllLinksUseCaseResult>
{
  constructor(private linksRepository: LinksRepository) {}

  async execute(): Promise<FindAllLinksUseCaseResult> {
    try {
      const links = await this.linksRepository.findMany();
      return Result.ok({ links });
    } catch {
      return Result.fail(new UnexpectedError());
    }
  }
}
