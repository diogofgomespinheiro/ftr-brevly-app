import type { FastifyReply, FastifyRequest } from 'fastify';

export abstract class BaseController {
  protected abstract executeImpl(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<unknown>;

  public async execute(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    try {
      await this.executeImpl(request, reply);
    } catch (err) {
      console.log(`[BaseController]: Uncaught controller error`);
      console.log(err);
      this.unexpected(reply);
    }
  }

  public ok<T>(reply: FastifyReply, status: number, dto?: T) {
    reply.type('application/json');

    if (dto) {
      return reply.status(status).send({ success: true, result: dto });
    } else {
      return reply.status(status).send({ success: true });
    }
  }

  public fail(
    reply: FastifyReply,
    status: number,
    error: Error | string,
    cause?: unknown
  ) {
    return reply.status(status).send({
      success: false,
      error: {
        type: error.toString(),
        ...(!cause
          ? { message: '' }
          : {
              message:
                typeof cause === 'object' ? JSON.stringify(cause) : cause,
            }),
      },
    });
  }

  public success<T>(reply: FastifyReply, dto?: T) {
    return this.ok(reply, 200, dto);
  }

  public created(reply: FastifyReply) {
    return this.ok(reply, 201);
  }

  public badRequest(
    reply: FastifyReply,
    message?: Error | string,
    cause?: unknown
  ) {
    return this.fail(reply, 400, message || 'Bad request', cause);
  }

  public unauthorized(
    reply: FastifyReply,
    message?: Error | string,
    cause?: unknown
  ) {
    return this.fail(reply, 401, message || 'Unauthorized', cause);
  }

  public paymentRequired(
    reply: FastifyReply,
    message?: Error | string,
    cause?: unknown
  ) {
    return this.fail(reply, 402, message || 'Payment required', cause);
  }

  public forbidden(
    reply: FastifyReply,
    message?: Error | string,
    cause?: unknown
  ) {
    return this.fail(reply, 403, message || 'Forbidden', cause);
  }

  public notFound(
    reply: FastifyReply,
    message?: Error | string,
    cause?: unknown
  ) {
    return this.fail(reply, 404, message || 'Not found', cause);
  }

  public conflict(
    reply: FastifyReply,
    message?: Error | string,
    cause?: unknown
  ) {
    return this.fail(reply, 409, message || 'Conflict', cause);
  }

  public tooMany(
    reply: FastifyReply,
    message?: Error | string,
    cause?: unknown
  ) {
    return this.fail(reply, 429, message || 'Too many requests', cause);
  }

  public unexpected(
    reply: FastifyReply,
    message?: Error | string,
    cause?: unknown
  ) {
    return this.fail(
      reply,
      500,
      message || 'An unexpected error occurred',
      cause
    );
  }
}
