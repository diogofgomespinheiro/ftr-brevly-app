import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify';

import type { ExportLinksUseCase } from '@/link-management/application/use-cases/export-links';
import { BaseController } from '@/shared/infra/http/base-controller';

export class ExportLinksController extends BaseController {
  constructor(private useCase: ExportLinksUseCase) {
    super();
  }

  async executeImpl(_: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const result = await this.useCase.execute();

      if (result.isFailure) {
        const error = result.getErrorValue();
        return this.unexpected(reply, error.message, error.cause);
      }

      return this.success(reply, { report_url: result.getValue().reportUrl });
    } catch (error) {
      const typedError = error as FastifyError;
      return this.unexpected(reply, typedError);
    }
  }
}
