import { Router } from 'express';
import {
  createCard, deleteCard, dislikeCard, getCards, likeCard,
} from '../controllers/cards';
import { validateCard, validateCardId } from '../middlewares/validation';

const router = Router();

router.get('/', getCards);

router.post('/', validateCard, createCard);

router.delete('/:cardId', validateCardId, deleteCard);

router.put('/:cardId/likes', validateCardId, likeCard);

router.delete('/:cardId/likes', validateCardId, dislikeCard);

export default router;
