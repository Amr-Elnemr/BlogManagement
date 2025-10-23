export default class CustomError extends Error {
  public statusCode: number;
  public errors?: string[] | undefined;

  constructor(message: string, code = 500, errors?: any[]) {
    super(message);
    this.statusCode = code;
    this.errors = errors;
  }
}
