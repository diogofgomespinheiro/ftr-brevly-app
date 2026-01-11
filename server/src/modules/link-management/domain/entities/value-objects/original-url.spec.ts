import { describe, expect, it } from "vitest";

import { InvalidUrlError, OriginalUrl } from "./original-url";

describe("OriginalUrl", () => {
	describe("Valid URLs", () => {
		it("should accept valid HTTP URL", () => {
			const result = OriginalUrl.create("http://example.com");
			expect(result.isSuccess).toBeTruthy();
			expect(result.getValue().value).toBe("http://example.com");
		});

		it("should accept valid HTTPS URL", () => {
			const result = OriginalUrl.create("https://example.com");
			expect(result.isSuccess).toBeTruthy();
			expect(result.getValue().value).toBe("https://example.com");
		});

		it("should accept URL with path", () => {
			const result = OriginalUrl.create("https://example.com/path/to/page");
			expect(result.isSuccess).toBeTruthy();
			expect(result.getValue().value).toBe("https://example.com/path/to/page");
		});

		it("should accept URL with query parameters", () => {
			const result = OriginalUrl.create(
				"https://example.com?param=value&other=test",
			);
			expect(result.isSuccess).toBeTruthy();
			expect(result.getValue().value).toBe(
				"https://example.com?param=value&other=test",
			);
		});

		it("should accept URL with fragment", () => {
			const result = OriginalUrl.create("https://example.com/page#section");
			expect(result.isSuccess).toBeTruthy();
			expect(result.getValue().value).toBe("https://example.com/page#section");
		});

		it("should accept URL with subdomain", () => {
			const result = OriginalUrl.create("https://subdomain.example.com");
			expect(result.isSuccess).toBeTruthy();
			expect(result.getValue().value).toBe("https://subdomain.example.com");
		});

		it("should accept URL with port", () => {
			const result = OriginalUrl.create("https://example.com:8080/path");
			expect(result.isSuccess).toBeTruthy();
			expect(result.getValue().value).toBe("https://example.com:8080/path");
		});

		it("should trim whitespace", () => {
			const result = OriginalUrl.create("  https://example.com  ");
			expect(result.isSuccess).toBeTruthy();
			expect(result.getValue().value).toBe("https://example.com");
		});
	});

	describe("Invalid URLs", () => {
		it("should reject empty string", () => {
			const result = OriginalUrl.create("");
			expect(result.isFailure).toBeTruthy();
			expect(result.getErrorValue()).toBeInstanceOf(InvalidUrlError);
			expect(result.getErrorValue().cause).toBe("URL cannot be empty.");
		});

		it("should reject whitespace only", () => {
			const result = OriginalUrl.create("       ");
			expect(result.isFailure).toBeTruthy();
			expect(result.getErrorValue()).toBeInstanceOf(InvalidUrlError);
			expect(result.getErrorValue().cause).toBe("URL cannot be empty.");
		});

		it("should reject URL with whitespace inside", () => {
			const result = OriginalUrl.create("https://exam ple.com");
			expect(result.isFailure).toBeTruthy();
			expect(result.getErrorValue()).toBeInstanceOf(InvalidUrlError);
			expect(result.getErrorValue().cause).toBe(
				"URL cannot contain white spaces.",
			);
		});

		it("should reject URL without protocol", () => {
			const result = OriginalUrl.create("example.com");
			expect(result.isFailure).toBeTruthy();
			expect(result.getErrorValue()).toBeInstanceOf(InvalidUrlError);
			expect(result.getErrorValue().cause).toBe("URL is not valid.");
		});

		it("should reject FTP protocol", () => {
			const result = OriginalUrl.create("ftp://example.com");
			expect(result.isFailure).toBeTruthy();
			expect(result.getErrorValue()).toBeInstanceOf(InvalidUrlError);
			expect(result.getErrorValue().cause).toBe(
				"URL must contain a valid protocol.",
			);
		});

		it("should reject invalid protocol", () => {
			const result = OriginalUrl.create("javascript:alert(1)");
			expect(result.isFailure).toBeTruthy();
			expect(result.getErrorValue()).toBeInstanceOf(InvalidUrlError);
			expect(result.getErrorValue().cause).toBe(
				"URL must contain a valid protocol.",
			);
		});

		it("should reject URL without hostname", () => {
			const result = OriginalUrl.create("https://");
			expect(result.isFailure).toBeTruthy();
			expect(result.getErrorValue()).toBeInstanceOf(InvalidUrlError);
			expect(result.getErrorValue().cause).toBe("URL is not valid.");
		});

		it("should reject invalid format", () => {
			const result = OriginalUrl.create("not a url");
			expect(result.isFailure).toBeTruthy();
			expect(result.getErrorValue()).toBeInstanceOf(InvalidUrlError);
			expect(result.getErrorValue().cause).toBe(
				"URL cannot contain white spaces.",
			);
		});

		it("should reject URL without TLD", () => {
			const result = OriginalUrl.create("https://example");
			expect(result.isFailure).toBeTruthy();
			expect(result.getErrorValue()).toBeInstanceOf(InvalidUrlError);
			expect(result.getErrorValue().cause).toBe(
				"URL must contain a valid hostname.",
			);
		});

		it("should reject too long URL", () => {
			const result = OriginalUrl.create(
				`https://example.com/${"a".repeat(3000)}`,
			);
			expect(result.isFailure).toBeTruthy();
			expect(result.getErrorValue()).toBeInstanceOf(InvalidUrlError);
			expect(result.getErrorValue().cause).toBe(
				`URL cannot exceed the max length of 2048.`,
			);
		});
	});

	describe("Equality", () => {
		it("should be equal to another OriginalUrl with same value", () => {
			const url1 = OriginalUrl.create("https://example.com");
			const url2 = OriginalUrl.create("https://example.com");

			expect(url1.getValue().equals(url2.getValue())).toBe(true);
		});

		it("should not be equal to OriginalUrl with different value", () => {
			const url1 = OriginalUrl.create("https://example.com");
			const url2 = OriginalUrl.create("https://other.com");

			expect(url1.getValue().equals(url2.getValue())).toBe(false);
		});
	});
});
