import { NOT_FOUND } from '../utils/constants';

export default class NotFoundError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = NOT_FOUND;
  }
}
