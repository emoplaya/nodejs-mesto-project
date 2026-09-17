import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import cors from 'cors';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';
import { createUser, login } from './controllers/users';
import auth from './middlewares/auth';
import { errorLogger, requestLogger } from './middlewares/logger';
import { validateSignin, validateSignup } from './middlewares/validation';
import NotFoundError from './errors/not-found-error';
import errorHandler from './middlewares/error-handler';
import { MONGO_URL } from './utils/config';

const { PORT = 3000 } = process.env;
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(requestLogger);

app.post('/signin', validateSignin, login);
app.post('/signup', validateSignup, createUser);

app.use(auth);

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

app.use(errorLogger);
app.use(errorHandler);

mongoose.connect(MONGO_URL);

app.listen(PORT, () => {
  console.log(`Сервер запущен на ${PORT}`);
});
