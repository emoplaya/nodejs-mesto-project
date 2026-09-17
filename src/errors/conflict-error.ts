import { CONFLICT } from '../utils/constants';

export default class ConflictError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = CONFLICT;
  }
}
