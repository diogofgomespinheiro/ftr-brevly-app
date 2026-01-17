import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify';

import {
  EntityValidationError,
  ResourceNotFoundError,
} from '@/core/application/use-cases/errors';
import type { FindLinkByShortCodeUseCase } from '@/link-management/application/use-cases/find-link-by-short-code';
import type { FindLinkByShortCodeRequestDTO } from '@/link-management/infra/http/schemas';
import { BaseController } from '@/shared/infra/http/base-controller';
import { LinkPresenter } from '../presenters';

export class FindLinkByShortCodeController extends BaseController {
  constructor(private useCase: FindLinkByShortCodeUseCase) {
    super();
  }

  async executeImpl(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const dto: FindLinkByShortCodeRequestDTO =
      request.params as FindLinkByShortCodeRequestDTO;

    try {
      const result = await this.useCase.execute({
        shortCode: dto.short_code,
      });

      if (result.isFailure) {
        const error = result.getErrorValue();

        switch (error.constructor) {
          case EntityValidationError:
            return this.badRequest(reply, error.message, error.cause);
          case ResourceNotFoundError:
            return this.notFound(reply, error.message, error.cause);
          default:
            return this.unexpected(reply, error.message, error.cause);
        }
      }

      return this.success(reply, {
        link: LinkPresenter.toHTTP(result.getValue().link),
      });
    } catch (error) {
      const typedError = error as FastifyError;
      return this.unexpected(reply, typedError);
    }
  }
}
