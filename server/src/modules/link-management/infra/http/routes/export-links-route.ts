import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

import { ExportLinksUseCase } from '@/link-management/application/use-cases/export-links';
import { ExportLinksController } from '@/link-management/infra/http/controllers';
import { exportLinksResponseSchema } from '@/link-management/infra/http/schemas';
import { DrizzleLinksRepository } from '@/shared/infra/database/drizzle/repositories';
import {
  errorResponseSchema,
  successResponseSchema,
} from '@/shared/infra/http/schemas';
import { LinksCsvTransformer } from '@/shared/infra/services';
import { R2StorageGateway } from '@/shared/infra/storage';

export const exportLinksRoute: FastifyPluginAsyncZod = async server => {
  server.get(
    '/links/export',
    {
      schema: {
        summary: 'Generate a csv report with all the created links',
        tags: ['links'],
        produces: ['application/json'],
        response: {
          200: successResponseSchema(exportLinksResponseSchema),
          500: errorResponseSchema.describe('Unexpect server error'),
        },
      },
    },
    async (request, reply) => {
      const linksRepository = new DrizzleLinksRepository();
      const storageGateway = new R2StorageGateway();
      const csvTransformer = new LinksCsvTransformer();
      const useCase = new ExportLinksUseCase(
        linksRepository,
        storageGateway,
        csvTransformer
      );
      const controller = new ExportLinksController(useCase);
      return controller.execute(request, reply);
    }
  );
};
