export class Result<E, S> {
  public isSuccess: boolean
  public isFailure: boolean
  private error?: E
  private _value?: S

  public constructor(isSuccess: boolean, error?: E, value?: S) {
    if (isSuccess && error) {
      throw new Error(
        'InvalidOperation: A result cannot be successful and contain an error',
      )
    }
    if (!isSuccess && !error) {
      throw new Error(
        'InvalidOperation: A failing result needs to contain an error message',
      )
    }

    this.isSuccess = isSuccess
    this.isFailure = !isSuccess
    this.error = error
    this._value = value

    Object.freeze(this)
  }

  public getValue(): S {
    if (!this.isSuccess) {
      throw new Error(
        "Can't get the value of an error result. Use 'getErrorValue' instead.",
      )
    }

    return this._value as S
  }

  public getErrorValue(): E {
    if (this.isSuccess) {
      throw new Error(
        "Can't get the error of a success result. Use 'getValue' instead.",
      )
    }

    return this.error as E
  }

  public static ok<S, E = never>(value?: S): Result<E, S> {
    return new Result<E, S>(true, undefined, value)
  }

  public static fail<E, S = never>(error: E): Result<E, S> {
    return new Result<E, S>(false, error, undefined)
  }

  public static combine(
    results: Result<Error, unknown>[],
  ): Result<Error, unknown> {
    for (const result of results) {
      if (result?.isFailure) return result
    }
    return Result.ok()
  }
}
