import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify';

import {
  EntityValidationError,
  ResourceNotFoundError,
} from '@/core/application/use-cases/errors';
import type { DeleteLinkUseCase } from '@/link-management/application/use-cases/delete-link';
import type { DeleteLinkRequestDTO } from '@/link-management/infra/http/schemas';
import { BaseController } from '@/shared/infra/http/base-controller';

export class DeleteLinkController extends BaseController {
  constructor(private useCase: DeleteLinkUseCase) {
    super();
  }

  async executeImpl(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const dto: DeleteLinkRequestDTO = request.params as DeleteLinkRequestDTO;

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
