import { Router } from 'express';
import { validateAvatar, validateProfile, validateUserId } from '../middlewares/validation';
import {
  getCurrentUser, getUserById, getUsers, updateUserAvatar, updateUserProfile,
} from '../controllers/users';

const router = Router();

router.get('/', getUsers);

router.get('/me', getCurrentUser);

router.get('/:userId', validateUserId, getUserById);

router.patch('/me', validateProfile, updateUserProfile);

router.patch('/me/avatar', validateAvatar, updateUserAvatar);

export default router;
