// src/domain/link-management/value-objects/short-code.spec.ts

import { describe, expect, it } from "vitest";
import { InvalidShortCodeError, ShortCode } from "./short-code";

describe("ShortCode", () => {
	describe("Valid short codes", () => {
		it("should accept alphanumeric short code", () => {
			const result = ShortCode.create("abc123");
			expect(result.isSuccess).toBe(true);
			expect(result.getValue().value).toBe("abc123");
		});

		it("should accept short code with hyphen", () => {
			const result = ShortCode.create("my-link");
			expect(result.isSuccess).toBe(true);
			expect(result.getValue().value).toBe("my-link");
		});

		it("should accept short code with underscore", () => {
			const result = ShortCode.create("my_link");
			expect(result.isSuccess).toBe(true);
			expect(result.getValue().value).toBe("my_link");
		});

		it("should accept mixed case with separators", () => {
			const result = ShortCode.create("My-Link_2024");
			expect(result.isSuccess).toBe(true);
			expect(result.getValue().value).toBe("My-Link_2024");
		});

		it("should accept hyphen in the middle", () => {
			const result = ShortCode.create("abc-def-123");
			expect(result.isSuccess).toBe(true);
			expect(result.getValue().value).toBe("abc-def-123");
		});

		it("should accept underscore in the middle", () => {
			const result = ShortCode.create("abc_def_123");
			expect(result.isSuccess).toBe(true);
			expect(result.getValue().value).toBe("abc_def_123");
		});

		it("should accept mix of hyphens and underscores", () => {
			const result = ShortCode.create("my-link_v2");
			expect(result.isSuccess).toBe(true);
			expect(result.getValue().value).toBe("my-link_v2");
		});
	});

	describe("Invalid short codes", () => {
		it("should reject empty string", () => {
			const result = ShortCode.create("");
			expect(result.isFailure).toBe(true);
			expect(result.getErrorValue()).toBeInstanceOf(InvalidShortCodeError);
			expect(result.getErrorValue().cause).toBe("Short code cannot be empty.");
		});

		it("should reject too short code", () => {
			const result = ShortCode.create("abc");
			expect(result.isFailure).toBe(true);
			expect(result.getErrorValue()).toBeInstanceOf(InvalidShortCodeError);
			expect(result.getErrorValue().cause).toBe(
				"Short code must be between 4 and 12 characters.",
			);
		});

		it("should reject too long code", () => {
			const result = ShortCode.create("abcdefghijklm");
			expect(result.isFailure).toBe(true);
			expect(result.getErrorValue()).toBeInstanceOf(InvalidShortCodeError);
			expect(result.getErrorValue().cause).toBe(
				"Short code must be between 4 and 12 characters.",
			);
		});

		it("should reject starting with hyphen", () => {
			const result = ShortCode.create("-mylink");
			expect(result.isFailure).toBe(true);
			expect(result.getErrorValue()).toBeInstanceOf(InvalidShortCodeError);
			expect(result.getErrorValue().cause).toBe(
				"Short code must contain only letters, numbers, hyphens and underscores. Cannot start/end with hyphen or underscore.",
			);
		});

		it("should reject starting with underscore", () => {
			const result = ShortCode.create("_mylink");
			expect(result.isFailure).toBe(true);
			expect(result.getErrorValue()).toBeInstanceOf(InvalidShortCodeError);
			expect(result.getErrorValue().cause).toBe(
				"Short code must contain only letters, numbers, hyphens and underscores. Cannot start/end with hyphen or underscore.",
			);
		});

		it("should reject ending with hyphen", () => {
			const result = ShortCode.create("mylink-");
			expect(result.isFailure).toBe(true);
			expect(result.getErrorValue()).toBeInstanceOf(InvalidShortCodeError);
			expect(result.getErrorValue().cause).toBe(
				"Short code must contain only letters, numbers, hyphens and underscores. Cannot start/end with hyphen or underscore.",
			);
		});

		it("should reject ending with underscore", () => {
			const result = ShortCode.create("mylink_");
			expect(result.isFailure).toBe(true);
			expect(result.getErrorValue()).toBeInstanceOf(InvalidShortCodeError);
			expect(result.getErrorValue().cause).toBe(
				"Short code must contain only letters, numbers, hyphens and underscores. Cannot start/end with hyphen or underscore.",
			);
		});

		it("should reject consecutive hyphens", () => {
			const result = ShortCode.create("my--link");
			expect(result.isFailure).toBe(true);
			expect(result.getErrorValue()).toBeInstanceOf(InvalidShortCodeError);
			expect(result.getErrorValue().cause).toBe(
				"Short code cannot contain consecutive hyphens or underscores.",
			);
		});

		it("should reject consecutive underscores", () => {
			const result = ShortCode.create("my__link");
			expect(result.isFailure).toBe(true);
			expect(result.getErrorValue()).toBeInstanceOf(InvalidShortCodeError);
			expect(result.getErrorValue().cause).toBe(
				"Short code cannot contain consecutive hyphens or underscores.",
			);
		});

		it("should reject consecutive mixed separators", () => {
			const result = ShortCode.create("my-_link");
			expect(result.isFailure).toBe(true);
			expect(result.getErrorValue()).toBeInstanceOf(InvalidShortCodeError);
			expect(result.getErrorValue().cause).toBe(
				"Short code cannot contain consecutive hyphens or underscores.",
			);
		});

		it("should reject special characters", () => {
			const result = ShortCode.create("abc@123");
			expect(result.isFailure).toBe(true);
			expect(result.getErrorValue()).toBeInstanceOf(InvalidShortCodeError);
			expect(result.getErrorValue().cause).toBe(
				"Short code must contain only letters, numbers, hyphens and underscores. Cannot start/end with hyphen or underscore.",
			);
		});

		it("should reject whitespace", () => {
			const result = ShortCode.create("my link");
			expect(result.isFailure).toBe(true);
			expect(result.getErrorValue()).toBeInstanceOf(InvalidShortCodeError);
			expect(result.getErrorValue().cause).toBe(
				"Short code must contain only letters, numbers, hyphens and underscores. Cannot start/end with hyphen or underscore.",
			);
		});

		it("should reject only hyphen", () => {
			const result = ShortCode.create("----");
			expect(result.isFailure).toBe(true);
			expect(result.getErrorValue()).toBeInstanceOf(InvalidShortCodeError);
			expect(result.getErrorValue().cause).toBe(
				"Short code must contain only letters, numbers, hyphens and underscores. Cannot start/end with hyphen or underscore.",
			);
		});

		it("should reject only underscore", () => {
			const result = ShortCode.create("____");
			expect(result.isFailure).toBe(true);
			expect(result.getErrorValue()).toBeInstanceOf(InvalidShortCodeError);
			expect(result.getErrorValue().cause).toBe(
				"Short code must contain only letters, numbers, hyphens and underscores. Cannot start/end with hyphen or underscore.",
			);
		});
	});

	describe("Edge cases", () => {
		it("should accept minimum length with separator", () => {
			const result = ShortCode.create("a-b2");
			expect(result.isSuccess).toBe(true);
			expect(result.getValue().value).toBe("a-b2");
		});

		it("should accept single character between separators", () => {
			const result = ShortCode.create("a-b-c-d");
			expect(result.isSuccess).toBe(true);
			expect(result.getValue().value).toBe("a-b-c-d");
		});

		it("should trim whitespace before validation", () => {
			const result = ShortCode.create("  my-link  ");
			expect(result.isSuccess).toBe(true);
			expect(result.getValue().value).toBe("my-link");
		});
	});
});
