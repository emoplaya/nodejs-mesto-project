import { Request, Response } from 'express';
import handleError from '../utils/handleError';
import { CREATED, FORBIDDEN, NOT_FOUND } from '../utils/constants';
import Card from '../models/card';

export const getCards = async (req: Request, res: Response) => {
  try {
    const cards = await Card.find({});
    return res.send({ data: cards });
  } catch (err) {
    return handleError(err, res);
  }
};

export const createCard = async (req: Request, res: Response) => {
  const { name, link } = req.body;
  try {
    const newCard = await Card.create({ name, link, owner: req.user._id });
    return res.status(CREATED).send({ data: newCard });
  } catch (err) {
    return handleError(err, res);
  }
};

export const deleteCard = async (req: Request, res: Response) => {
  try {
    const card = await Card.findById(req.params.cardId);
    if (!card) {
      return res.status(NOT_FOUND).send({ message: 'Карточка не найдена' });
    }
    if (card.owner.toString() !== req.user._id) {
      return res.status(FORBIDDEN).send({ message: 'Нельзя удалить чужую карточку' });
    }
    await card.deleteOne();
    return res.send({ data: card });
  } catch (err) {
    return handleError(err, res);
  }
};

export const likeCard = async (req: Request, res: Response) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      return res.status(NOT_FOUND).send({ message: 'Карточка не найдена' });
    }
    return res.send({ data: card });
  } catch (err) {
    return handleError(err, res);
  }
};

export const dislikeCard = async (req: Request, res: Response) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      return res.status(NOT_FOUND).send({ message: 'Карточка не найдена' });
    }
    return res.send({ data: card });
  } catch (err) {
    return handleError(err, res);
  }
};
