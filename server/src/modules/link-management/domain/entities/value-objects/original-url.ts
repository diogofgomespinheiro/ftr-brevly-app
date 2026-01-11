import { ValueObject } from '@/core/domain';
import { Result } from '@/core/shared';

interface OriginalUrlProps {
  value: string;
}

export class OriginalUrl extends ValueObject<OriginalUrlProps> {
  private static readonly MAX_LENGTH = 2048;
  private static readonly ALLOWED_PROTOCOLS = ['http:', 'https:'];

  get value(): string {
    return this.props.value;
  }

  private constructor(props: OriginalUrlProps) {
    super(props);
  }

  public static create(url: string): Result<InvalidUrlError, OriginalUrl> {
    const { isValid, reason = '' } = OriginalUrl.validate(url);

    if (!isValid) {
      return Result.fail(new InvalidUrlError(reason));
    }

    return Result.ok(new OriginalUrl({ value: OriginalUrl.normalize(url) }));
  }

  private static validate(value: string): {
    isValid: boolean;
    reason?: string;
  } {
    if (!value || value.trim().length === 0) {
      return { isValid: false, reason: 'URL cannot be empty.' };
    }

    try {
      const trimmedValue = value.trim();

      const hasWhiteSpaces = /\s/.test(trimmedValue);
      if (hasWhiteSpaces)
        return { isValid: false, reason: 'URL cannot contain white spaces.' };

      const exceedsMaxLength = trimmedValue.length > OriginalUrl.MAX_LENGTH;
      if (exceedsMaxLength)
        return {
          isValid: false,
          reason: `URL cannot exceed the max length of ${OriginalUrl.MAX_LENGTH}.`,
        };

      const url = new URL(trimmedValue);
      const hasValidProtocol = OriginalUrl.ALLOWED_PROTOCOLS.includes(
        url.protocol
      );
      if (!hasValidProtocol)
        return {
          isValid: false,
          reason: 'URL must contain a valid protocol.',
        };

      const hostnameExists = url.hostname || url.hostname.length === 0;
      if (!hostnameExists)
        return { isValid: false, reason: 'URL must contain a hostname.' };

      const isValidHostname =
        url.hostname.includes('.') && url.hostname !== 'localhost';
      if (!isValidHostname)
        return {
          isValid: false,
          reason: 'URL must contain a valid hostname.',
        };

      return { isValid: true };
    } catch {
      return {
        isValid: false,
        reason: 'URL is not valid.',
      };
    }
  }

  public static normalize(value: string): string {
    const trimmedUrl = value.trim();
    const url = new URL(trimmedUrl);

    if (url.pathname === '/' && !url.search && !url.hash) {
      return trimmedUrl.replace(/\/$/, '');
    }

    return trimmedUrl;
  }
}

export class InvalidUrlError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidUrlError';
  }
}
