import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import {
  CREATED, MONGO_DUPLICATE_KEY,
} from '../utils/constants';
import User from '../models/user';
import NotFoundError from '../errors/not-found-error';
import BadRequestError from '../errors/bad-request-error';
import ConflictError from '../errors/conflict-error';
import UnauthorizedError from '../errors/unauthorized-error';
import { JWT_SECRET } from '../utils/config';

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({});
    return res.send({ data: users });
  } catch (err) {
    return next(err);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return next(new NotFoundError('Пользователь не найден'));
    }
    return res.send({ data: user });
  } catch (err) {
    return next(err);
  }
};

export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return next(new NotFoundError('Пользователь не найден'));
    }
    return res.send({ data: user });
  } catch (err) {
    return next(err);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name, about, avatar, email, password: hash,
    });
    return res.status(CREATED).send({
      data: {
        _id: newUser._id,
        name: newUser.name,
        about: newUser.about,
        avatar: newUser.avatar,
        email: newUser.email,
      },
    });
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return next(new BadRequestError(err.message));
    }
    if (err instanceof Error && 'code' in err && err.code === MONGO_DUPLICATE_KEY) {
      return next(new ConflictError('Пользователь с таким email уже существует'));
    }
    return next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(new UnauthorizedError('Неправильные почта или пароль'));
    }
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      return next(new UnauthorizedError('Неправильные почта или пароль'));
    }
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    return res.send({ token });
  } catch (err) {
    return next(err);
  }
};

export const updateUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  const { name, about } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!user) {
      return next(new NotFoundError('Пользователь не найден'));
    }
    return res.send({ data: user });
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return next(new BadRequestError(err.message));
    }
    return next(err);
  }
};

export const updateUserAvatar = async (req: Request, res: Response, next: NextFunction) => {
  const { avatar } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    );
    if (!user) {
      return next(new NotFoundError('Пользователь не найден'));
    }
    return res.send({ data: user });
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return next(new BadRequestError(err.message));
    }
    return next(err);
  }
};
