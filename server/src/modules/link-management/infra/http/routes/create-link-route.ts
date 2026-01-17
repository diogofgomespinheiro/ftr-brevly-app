import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

import { CreateLinkUseCase } from '@/link-management/application/use-cases/create-link';
import { CreateLinkController } from '@/link-management/infra/http/controllers';
import { createLinkRequestSchema } from '@/link-management/infra/http/schemas';
import { DrizzleLinksRepository } from '@/shared/infra/database/drizzle/repositories';
import {
  errorResponseSchema,
  successResponseSchema,
} from '@/shared/infra/http/schemas';

export const createLinkRoute: FastifyPluginAsyncZod = async server => {
  server.post(
    '/links',
    {
      schema: {
        summary: 'Creates a link',
        tags: ['links'],
        consumes: ['application/json'],
        produces: ['application/json'],
        body: createLinkRequestSchema,
        response: {
          201: successResponseSchema(),
          400: errorResponseSchema.describe('Request with wrong format'),
          409: errorResponseSchema.describe('Conflict with existing link'),
          500: errorResponseSchema.describe('Unexpect server error'),
        },
      },
    },
    async (request, reply) => {
      const linksRepository = new DrizzleLinksRepository();
      const useCase = new CreateLinkUseCase(linksRepository);
      const controller = new CreateLinkController(useCase);
      return controller.execute(request, reply);
    }
  );
};
