import { NextFunction, Request, Response } from 'express';
import { isCelebrateError } from 'celebrate';
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from '../utils/constants';

interface IHttpError extends Error {
  statusCode?: number;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (err: IHttpError, req: Request, res: Response, next: NextFunction) => {
  if (isCelebrateError(err)) {
    const message = [...err.details.values()].map((detail) => detail.message).join(', ');
    return res.status(BAD_REQUEST).send({ message });
  }

  const { statusCode = INTERNAL_SERVER_ERROR, message } = err;

  return res.status(statusCode).send({
    message: statusCode === INTERNAL_SERVER_ERROR ? 'На сервере произошла ошибка' : message,
  });
};
