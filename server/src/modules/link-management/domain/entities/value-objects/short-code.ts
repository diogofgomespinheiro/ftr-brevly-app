import { ValueObject } from "@/core/domain";
import { Result } from "@/core/shared";

interface ShortCodeProps {
	value: string;
}

export class ShortCode extends ValueObject<ShortCodeProps> {
	private static readonly MIN_LENGTH = 4;
	private static readonly MAX_LENGTH = 12;
	private static readonly VALID_PATTERN =
		/^[a-zA-Z0-9]([a-zA-Z0-9_-]*[a-zA-Z0-9])?$/;

	get value(): string {
		return this.props.value;
	}

	private constructor(props: ShortCodeProps) {
		super(props);
	}

	public static create(
		value: string,
	): Result<InvalidShortCodeError, ShortCode> {
		const { isValid, reason = "" } = ShortCode.validate(value);

		if (!isValid) {
			return Result.fail(new InvalidShortCodeError(value, reason));
		}

		return Result.ok(new ShortCode({ value: value.trim() }));
	}

	private static validate(value: string): {
		isValid: boolean;
		reason?: string;
	} {
		if (!value || value.trim().length === 0) {
			return { isValid: false, reason: "Short code cannot be empty." };
		}

		const trimmedValue = value.trim();
		const isBelowMinLength = trimmedValue.length < ShortCode.MIN_LENGTH;
		const exceedsMaxLength = trimmedValue.length > ShortCode.MAX_LENGTH;
		if (isBelowMinLength || exceedsMaxLength)
			return {
				isValid: false,
				reason: `Short code must be between ${ShortCode.MIN_LENGTH} and ${ShortCode.MAX_LENGTH} characters.`,
			};

		if (!ShortCode.VALID_PATTERN.test(trimmedValue))
			return {
				isValid: false,
				reason:
					"Short code must contain only letters, numbers, hyphens and underscores. Cannot start/end with hyphen or underscore.",
			};

		const hasConsecutiveSeparators = /[-_]{2,}/.test(trimmedValue);
		if (hasConsecutiveSeparators) {
			return {
				isValid: false,
				reason: "Short code cannot contain consecutive hyphens or underscores.",
			};
		}

		return { isValid: true };
	}
}

export class InvalidShortCodeError extends Error {
	constructor(value: string, reason: string) {
		super(`Invalid short code: ${value}`, { cause: reason });
		this.name = "InvalidShortCodeError";
	}
}
