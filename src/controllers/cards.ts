import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { CREATED } from '../utils/constants';
import Card from '../models/card';
import BadRequestError from '../errors/bad-request-error';
import NotFoundError from '../errors/not-found-error';
import ForbiddenError from '../errors/forbidden-error';

export const getCards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cards = await Card.find({});
    return res.send({ data: cards });
  } catch (err) {
    return next(err);
  }
};

export const createCard = async (req: Request, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  try {
    const newCard = await Card.create({ name, link, owner: req.user._id });
    return res.status(CREATED).send({ data: newCard });
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return next(new BadRequestError(err.message));
    }
    return next(err);
  }
};

export const deleteCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const card = await Card.findById(req.params.cardId);
    if (!card) {
      return next(new NotFoundError('Карточка не найдена'));
    }
    if (card.owner.toString() !== req.user._id) {
      return next(new ForbiddenError('Нельзя удалить чужую карточку'));
    }
    await card.deleteOne();
    return res.send({ data: card });
  } catch (err) {
    return next(err);
  }
};

export const likeCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      return next(new NotFoundError('Карточка не найдена'));
    }
    return res.send({ data: card });
  } catch (err) {
    return next(err);
  }
};

export const dislikeCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      return next(new NotFoundError('Карточка не найдена'));
    }
    return res.send({ data: card });
  } catch (err) {
    return next(err);
  }
};
