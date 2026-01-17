import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify';

import {
  EntityValidationError,
  ResourceNotFoundError,
} from '@/core/application/use-cases/errors';
import type { IncrementLinkAccessCountUseCase } from '@/link-management/application/use-cases/increment-link-access-count';
import type { IncrementLinkAccessCountRequestDTO } from '@/link-management/infra/http/schemas';
import { BaseController } from '@/shared/infra/http/base-controller';

export class IncrementLinkAccessCountController extends BaseController {
  constructor(private useCase: IncrementLinkAccessCountUseCase) {
    super();
  }

  async executeImpl(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const dto: IncrementLinkAccessCountRequestDTO =
      request.params as IncrementLinkAccessCountRequestDTO;

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

      return this.success(reply);
    } catch (error) {
      const typedError = error as FastifyError;
      return this.unexpected(reply, typedError);
    }
  }
}
