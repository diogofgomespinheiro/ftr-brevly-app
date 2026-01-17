import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

import { FindAllLinksUseCase } from '@/link-management/application/use-cases/find-all-links';
import { FindAllLinksController } from '@/link-management/infra/http/controllers';
import { findAllLinksResponseSchema } from '@/link-management/infra/http/schemas';
import { DrizzleLinksRepository } from '@/shared/infra/database/drizzle/repositories';
import {
  errorResponseSchema,
  successResponseSchema,
} from '@/shared/infra/http/schemas';

export const findAllLinksRoute: FastifyPluginAsyncZod = async server => {
  server.get(
    '/links',
    {
      schema: {
        summary: 'Fetches all the existing links',
        tags: ['links'],
        produces: ['application/json'],
        response: {
          200: successResponseSchema(findAllLinksResponseSchema),
          500: errorResponseSchema.describe('Unexpect server error'),
        },
      },
    },
    async (request, reply) => {
      const linksRepository = new DrizzleLinksRepository();
      const useCase = new FindAllLinksUseCase(linksRepository);
      const controller = new FindAllLinksController(useCase);
      return controller.execute(request, reply);
    }
  );
};
