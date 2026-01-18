import { fastifyCors } from '@fastify/cors';
import { fastifyMultipart } from '@fastify/multipart';
import { fastifySwagger } from '@fastify/swagger';
import { fastifySwaggerUi } from '@fastify/swagger-ui';
import { fastify } from 'fastify';
import {
  hasZodFastifySchemaValidationErrors,
  isResponseSerializationError,
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';

import {
  createLinkRoute,
  deleteLinkRoute,
  exportLinksRoute,
  findAllLinksRoute,
  findLinkByShortCodeRoute,
  incrementLinkAccessCountRoute,
} from '@/link-management/infra/http/routes';
import { env } from '@/shared/config/env';

const server = fastify();
server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);
server.register(fastifyCors, {
  origin: '*',
  methods: ['GET', 'PUT', 'PATCH', 'POST', 'DELETE'],
});
server.register(fastifyMultipart);
server.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Brevly Server API',
      description: 'Brevly Server API Documentation',
      version: '1.0.0',
    },
  },
  transform: jsonSchemaTransform,
});
server.register(fastifySwaggerUi, {
  routePrefix: '/docs',
});

server.register(createLinkRoute);
server.register(deleteLinkRoute);
server.register(exportLinksRoute);
server.register(findAllLinksRoute);
server.register(findLinkByShortCodeRoute);
server.register(incrementLinkAccessCountRoute);

server.setErrorHandler(async (error, _, reply) => {
  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.status(400).send({
      success: false,
      error: {
        type: 'SCHEMA_VALIDATION_ERROR',
        message: JSON.stringify(error.validation),
      },
    });
  }

  if (isResponseSerializationError(error)) {
    return reply.status(500).send({
      success: false,
      error: {
        type: 'UNEXPECTED_ERROR',
        message: error.cause.issues,
      },
    });
  }

  return reply.status(500).send({
    success: false,
    error: {
      type: 'UNEXPECTED_ERROR',
      message: JSON.stringify(error),
    },
  });
});

server.listen({ host: '0.0.0.0', port: env.PORT }).then(() => {
  console.log(`HTTP Server running on port ${env.PORT}`);
  console.log(
    `Take a look into the documentation http://localhost:${env.PORT}/docs`
  );
});
