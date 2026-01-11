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
    if (!OriginalUrl.isValid(url)) {
      return Result.fail(new InvalidUrlError(url));
    }

    return Result.ok(new OriginalUrl({ value: OriginalUrl.normalize(url) }));
  }

  private static isValid(value: string): boolean {
    if (!value || value.trim().length === 0) {
      return false;
    }

    try {
      const trimmedValue = value.trim();

      const hasWhiteSpaces = /\s/.test(trimmedValue);
      if (hasWhiteSpaces) return false;

      const exceedsMaxLength = trimmedValue.length > OriginalUrl.MAX_LENGTH;
      if (exceedsMaxLength) return false;

      const url = new URL(trimmedValue);
      const hasValidProtocol = OriginalUrl.ALLOWED_PROTOCOLS.includes(
        url.protocol
      );
      if (!hasValidProtocol) return false;

      const hostnameExists = url.hostname || url.hostname.length === 0;
      if (!hostnameExists) return false;

      const isValidHostname =
        url.hostname.includes('.') && url.hostname !== 'localhost';
      if (!isValidHostname) return false;

      return true;
    } catch {
      return false;
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
  constructor(value: string) {
    super(`Invalid url: ${value}`);
    this.name = 'InvalidUrlError';
  }
}
