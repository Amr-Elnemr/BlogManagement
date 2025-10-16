export default class CustomError extends Error {
  public statusCode: number;
  public errors?: [string] | undefined;

  constructor(message: string, code: number, errors?: [string]) {
    super(message);
    this.statusCode = code;
    this.errors = errors;
  }
}
