import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

import { DeleteLinkUseCase } from '@/link-management/application/use-cases/delete-link';
import { DeleteLinkController } from '@/link-management/infra/http/controllers';
import { deleteLinkParamsSchema } from '@/link-management/infra/http/schemas';
import { DrizzleLinksRepository } from '@/shared/infra/database/drizzle/repositories';
import {
  errorResponseSchema,
  successResponseSchema,
} from '@/shared/infra/http/schemas';

export const deleteLinkRoute: FastifyPluginAsyncZod = async server => {
  server.delete(
    '/links/:short_code',
    {
      schema: {
        summary: 'Deletes a link by short code',
        tags: ['links'],
        produces: ['application/json'],
        params: deleteLinkParamsSchema,
        response: {
          200: successResponseSchema(),
          400: errorResponseSchema.describe('Request with wrong format'),
          404: errorResponseSchema.describe('Error finding the inserted link'),
          500: errorResponseSchema.describe('Unexpect server error'),
        },
      },
    },
    async (request, reply) => {
      const linksRepository = new DrizzleLinksRepository();
      const useCase = new DeleteLinkUseCase(linksRepository);
      const controller = new DeleteLinkController(useCase);
      return controller.execute(request, reply);
    }
  );
};
