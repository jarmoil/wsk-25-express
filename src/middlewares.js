import sharp from 'sharp';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import promisePool from './utils/database.js';

const createThumbnail = async (req, res, next) => {
  console.log('todo: tee kuvakäsittely', req.file);
  if (!req.file) {
    next('Kuvaa ei löydy');
    // next('Oh no, kuvaa ei löydy 🧐');
    return;
  }

  let extension = 'jpg';
  if (req.file.mimetype === 'image/png') {
    // if (req.file.mimetype.includes('/png')) {
    extension = 'png';
  }

  await sharp(req.file.path)
    .resize(100, 100)
    .toFile(`${req.file.path}_thumb.${extension}`);

  next();
};

const authenticateToken = (req, res, next) => {
  console.log('authenticateToken', req.headers);
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  console.log('token', token);
  if (token == null) {
    return res.sendStatus(401);
  }
  try {
    res.locals.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    res.status(403).send({message: 'invalid token'});
    console.log(err);
  }
};

const checkCatOwnership = async (req, res, next) => {
  try {
    const userId = res.locals.user.user_id; // Extract user ID from the token
    const catId = req.params.id;

    // Query the database to check if the cat belongs to the user
    const [rows] = await promisePool.execute(
      'SELECT owner FROM wsk_cats WHERE cat_id = ?',
      [catId]
    );

    if (rows.length === 0) {
      return res.status(404).json({message: 'Cat not found'});
    }

    if (rows[0].owner !== userId) {
      return res
        .status(403)
        .json({message: 'Forbidden: Not the owner of the cat'});
    }

    next();
  } catch (error) {
    console.error('Error in checkCatOwnership:', error);
    res.status(500).json({message: 'Internal Server Error'});
  }
};

const checkUserOwnership = (req, res, next) => {
  const userId = res.locals.user.user_id; // Extract user ID from the token
  const targetUserId = parseInt(req.params.id, 10); // Extract target user ID from the route

  if (userId !== targetUserId) {
    return res
      .status(403)
      .json({message: "Forbidden: Cannot modify another user's data"});
  }

  next();
};

const isAdmin = (req, res, next) => {
  if (res.locals.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({message: 'Forbidden: Admin access required'});
};

export default createThumbnail;
export {authenticateToken, checkCatOwnership, checkUserOwnership, isAdmin};
