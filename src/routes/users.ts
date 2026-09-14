import { Router } from 'express';
import {
  createUser, getCurrentUser, getUserById, getUsers, updateUserAvatar, updateUserProfile,
} from '../controllers/users';

const router = Router();

router.get('/', getUsers);

router.get('/me', getCurrentUser);

router.get('/:userId', getUserById);

router.post('/', createUser);

router.patch('/me', updateUserProfile);

router.patch('/me/avatar', updateUserAvatar);

export default router;
