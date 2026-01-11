import { describe, expect, it } from 'vitest';

import { Result } from '@/core/shared/result';

function doSomeThing(shouldSuccess: boolean): Result<string, number> {
  if (shouldSuccess) {
    return Result.ok(10);
  } else {
    return Result.fail('error');
  }
}

describe('Result', () => {
  it('should throw and invalid operation error due to both values being true', () => {
    expect(() => new Result(true, true, null)).toThrowError();
  });

  it('should throw and invalid operation error due to both values being false', () => {
    expect(() => new Result(false, false, null)).toThrowError();
  });

  it('should be able to return a success result', () => {
    const result = doSomeThing(true);

    expect(result.isSuccess).toBe(true);
    expect(result.isFailure).toBe(false);
    expect(result.getValue()).toBeDefined();
    expect(() => result.getErrorValue()).toThrowError();
  });

  it('should be able to return a failure result', () => {
    const result = doSomeThing(false);

    expect(result.isFailure).toBe(true);
    expect(result.isSuccess).toBe(false);
    expect(result.getErrorValue()).toBeDefined();
    expect(() => result.getValue()).toThrowError();
  });
});
