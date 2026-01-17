import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

import { IncrementLinkAccessCountUseCase } from '@/link-management/application/use-cases/increment-link-access-count';
import { IncrementLinkAccessCountController } from '@/link-management/infra/http/controllers';
import { incrementLinkAccessCountParamsSchema } from '@/link-management/infra/http/schemas';
import { DrizzleLinksRepository } from '@/shared/infra/database/drizzle/repositories';
import {
  errorResponseSchema,
  successResponseSchema,
} from '@/shared/infra/http/schemas';

export const incrementLinkAccessCountRoute: FastifyPluginAsyncZod =
  async server => {
    server.put(
      '/links/:short_code/increment',
      {
        schema: {
          summary: 'Increments a link access count',
          tags: ['links'],
          produces: ['application/json'],
          params: incrementLinkAccessCountParamsSchema,
          response: {
            200: successResponseSchema(),
            400: errorResponseSchema.describe('Request with wrong format'),
            404: errorResponseSchema.describe(
              'Error finding the inserted link'
            ),
            500: errorResponseSchema.describe('Unexpect server error'),
          },
        },
      },
      async (request, reply) => {
        const linksRepository = new DrizzleLinksRepository();
        const useCase = new IncrementLinkAccessCountUseCase(linksRepository);
        const controller = new IncrementLinkAccessCountController(useCase);
        return controller.execute(request, reply);
      }
    );
  };
