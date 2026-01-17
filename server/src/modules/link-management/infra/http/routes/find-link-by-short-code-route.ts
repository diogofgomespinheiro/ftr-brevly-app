import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

import { FindLinkByShortCodeUseCase } from '@/link-management/application/use-cases/find-link-by-short-code';
import { FindLinkByShortCodeController } from '@/link-management/infra/http/controllers';
import {
  findLinkByShortCodeParamsSchema,
  findLinkByShortCodeResponseSchema,
} from '@/link-management/infra/http/schemas';
import { DrizzleLinksRepository } from '@/shared/infra/database/drizzle/repositories';
import {
  errorResponseSchema,
  successResponseSchema,
} from '@/shared/infra/http/schemas';

export const findLinkByShortCodeRoute: FastifyPluginAsyncZod = async server => {
  server.get(
    '/links/:short_code',
    {
      schema: {
        summary: 'Fetches a link by short code',
        tags: ['links'],
        produces: ['application/json'],
        params: findLinkByShortCodeParamsSchema,
        response: {
          200: successResponseSchema(findLinkByShortCodeResponseSchema),
          400: errorResponseSchema.describe('Request with wrong format'),
          404: errorResponseSchema.describe('Error finding the inserted link'),
          500: errorResponseSchema.describe('Unexpect server error'),
        },
      },
    },
    async (request, reply) => {
      const linksRepository = new DrizzleLinksRepository();
      const useCase = new FindLinkByShortCodeUseCase(linksRepository);
      const controller = new FindLinkByShortCodeController(useCase);
      return controller.execute(request, reply);
    }
  );
};
