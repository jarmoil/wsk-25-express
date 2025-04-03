import express from 'express';
import {
  getUser,
  getUserById,
  postUser,
  putUser,
  deleteUser,
} from '../controllers/user-controller.js';
import {authenticateToken, checkUserOwnership} from '../../middlewares.js';

const userRouter = express.Router();

userRouter.route('/').get(getUser).post(postUser);
userRouter
  .route('/:id')
  .get(getUserById)
  .put(authenticateToken, checkUserOwnership, putUser) // Only the user can update their info
  .delete(authenticateToken, deleteUser);
export default userRouter;
