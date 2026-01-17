import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify';

import type { FindAllLinksUseCase } from '@/link-management/application/use-cases/find-all-links';
import { LinkPresenter } from '@/link-management/infra/http/presenters';
import { BaseController } from '@/shared/infra/http/base-controller';

export class FindAllLinksController extends BaseController {
  constructor(private useCase: FindAllLinksUseCase) {
    super();
  }

  async executeImpl(_: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const result = await this.useCase.execute();

      if (result.isFailure) {
        const error = result.getErrorValue();
        return this.unexpected(reply, error.message, error.cause);
      }

      return this.success(reply, {
        links: LinkPresenter.toHTTPList(result.getValue().links),
      });
    } catch (error) {
      const typedError = error as FastifyError;
      return this.unexpected(reply, typedError);
    }
  }
}
