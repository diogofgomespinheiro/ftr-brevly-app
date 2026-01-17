import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify';

import {
  ConflictError,
  EntityValidationError,
} from '@/core/application/use-cases/errors';
import type { CreateLinkUseCase } from '@/link-management/application/use-cases/create-link';
import type { CreateLinkRequestDTO } from '@/link-management/infra/http/schemas';
import { BaseController } from '@/shared/infra/http/base-controller';

export class CreateLinkController extends BaseController {
  constructor(private useCase: CreateLinkUseCase) {
    super();
  }

  async executeImpl(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const dto: CreateLinkRequestDTO = request.body as CreateLinkRequestDTO;

    try {
      const result = await this.useCase.execute({
        originalUrl: dto.original_url,
        shortCode: dto.short_code,
      });

      if (result.isFailure) {
        const error = result.getErrorValue();

        switch (error.constructor) {
          case EntityValidationError:
            return this.badRequest(reply, error.message, error.cause);
          case ConflictError:
            return this.conflict(reply, error.message, error.cause);
          default:
            return this.unexpected(reply, error.message, error.cause);
        }
      }

      return this.created(reply);
    } catch (error) {
      const typedError = error as FastifyError;
      return this.unexpected(reply, typedError);
    }
  }
}
