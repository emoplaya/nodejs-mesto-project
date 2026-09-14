import { Response } from 'express';
import mongoose from 'mongoose';
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from './constants';

export default (err: unknown, res: Response) => {
  if (err instanceof mongoose.Error.ValidationError || err instanceof mongoose.Error.CastError) {
    return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
  }
  return res.status(INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
};
