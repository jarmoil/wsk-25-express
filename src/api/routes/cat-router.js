import express from 'express';
import {
  getCat,
  getCatById,
  postCat,
  putCat,
  deleteCat,
  getCatByOwnerId,
} from '../controllers/cat-controller.js';
import multer from 'multer';
import createThumbnail, {
  authenticateToken,
  checkCatOwnership,
} from '../../middlewares.js';

const catRouter = express.Router();

const upload = multer({dest: 'uploads/'});

catRouter
  .route('/')
  .get(getCat)
  .post(upload.single('file'), createThumbnail, postCat);

catRouter
  .route('/:id')
  .get(getCatById)
  .put(authenticateToken, checkCatOwnership, putCat) // Only owner can update
  .delete(authenticateToken, checkCatOwnership, deleteCat); // Only owner can delete

catRouter.route('/:id').get(getCatById).put(putCat).delete(deleteCat);

// TODO: Implement this route
catRouter.route('/owner/:id').get(getCatByOwnerId);

export default catRouter;
