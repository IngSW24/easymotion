import { HttpException, HttpStatus } from "@nestjs/common";

export type Result<T, E = string> =
  | { success: true; data: T }
  | { success: false; errors: E[]; code: HttpStatus };

export type ResultPromise<T, E = string> = Promise<Result<T, E>>;

export const isSuccessResult = <T, E>(
  result: Result<T, E>
): result is { success: true; data: T } => result.success;

export const resultToHttpException = <E = string>(result: {
  success: false;
  errors: E[];
  code: HttpStatus;
}) => new HttpException({ errors: result.errors }, result.code);
