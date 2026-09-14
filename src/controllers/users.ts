import { Request, Response } from 'express';
import handleError from '../utils/handleError';
import { CREATED, NOT_FOUND } from '../utils/constants';
import User from '../models/user';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({});
    return res.send({ data: users });
  } catch (err) {
    return handleError(err, res);
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(NOT_FOUND).send({ message: 'Пользователь не найден' });
    }
    return res.send({ data: user });
  } catch (err) {
    return handleError(err, res);
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(NOT_FOUND).send({ message: 'Пользователь не найден' });
    }
    return res.send({ data: user });
  } catch (err) {
    return handleError(err, res);
  }
};

export const createUser = async (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;
  try {
    const newUser = await User.create({ name, about, avatar });
    return res.status(CREATED).send({ data: newUser });
  } catch (err) {
    return handleError(err, res);
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  const { name, about } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!user) {
      return res.status(NOT_FOUND).send({ message: 'Пользователь не найден' });
    }
    return res.send({ data: user });
  } catch (err) {
    return handleError(err, res);
  }
};

export const updateUserAvatar = async (req: Request, res: Response) => {
  const { avatar } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    );
    if (!user) {
      return res.status(NOT_FOUND).send({ message: 'Пользователь не найден' });
    }
    return res.send({ data: user });
  } catch (err) {
    return handleError(err, res);
  }
};
