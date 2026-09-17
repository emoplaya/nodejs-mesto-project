import { BAD_REQUEST } from '../utils/constants';

export default class BadRequestError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = BAD_REQUEST;
  }
}
