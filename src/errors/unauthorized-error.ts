import { UNAUTHORIZED } from '../utils/constants';

export default class UnauthorizedError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = UNAUTHORIZED;
  }
}
