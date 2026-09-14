import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { NOT_FOUND } from './utils/constants';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';

const { PORT = 3000 } = process.env;
const app = express();

app.use(cors());
app.use(express.json());
app.use((req: Request, res: Response, next: NextFunction) => {
  req.user = {
    _id: '6a9f099bc9e159ef94ed3d33',
  };

  next();
});

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);
app.use((req: Request, res: Response) => {
  res.status(NOT_FOUND).send({ message: 'Запрашиваемый ресурс не найден' });
});

mongoose.connect('mongodb://localhost:27017/mestodb');

app.listen(PORT, () => {
  console.log(`Сервер запущен на ${PORT}`);
});
