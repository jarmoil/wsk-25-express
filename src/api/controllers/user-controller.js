import {
  addUser,
  findUserById,
  listAllUsers,
  modifyUser,
  removeUser,
} from '../models/user-model.js';

import bcrypt from 'bcrypt';

const getUser = async (req, res) => {
  res.json(await listAllUsers());
};

const getUserById = async (req, res) => {
  const user = await findUserById(req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.sendStatus(404);
  }
};

const postUser = async (req, res) => {
  try {
    const {name, username, password, email} = req.body;

    // Validate required fields
    if (!name || !username || !password || !email) {
      return res.status(400).json({error: 'Missing required fields'});
    }

    req.body.password = bcrypt.hashSync(password, 10);
    const result = await addUser(req.body);

    if (result.user_id) {
      res.status(201).json(result);
    } else {
      res.status(400).json({error: 'Failed to add user'});
    }
  } catch (error) {
    console.error('Error in POST /users:', error);
    res.status(500).json({error: 'Internal Server Error'});
  }
};
const putUser = async (req, res) => {
  const {user_id, role} = res.locals.user; // Extract user info from token
  const targetUserId = parseInt(req.params.id, 10);

  // Allow only the user themselves or an admin to update
  if (user_id !== targetUserId && role !== 'admin') {
    return res
      .status(403)
      .json({message: 'Forbidden: Cannot modify this user'});
  }

  const result = await modifyUser(req.body, targetUserId, role);
  if (result.message) {
    res.status(200).json(result);
  } else {
    res.status(400).json({message: 'Failed to update user'});
  }
};

const deleteUser = async (req, res) => {
  const {user_id, role} = res.locals.user; // Extract user info from token
  const targetUserId = parseInt(req.params.id, 10);

  // Allow only the user themselves or an admin to delete
  if (user_id !== targetUserId && role !== 'admin') {
    return res
      .status(403)
      .json({message: 'Forbidden: Cannot delete this user'});
  }

  const result = await removeUser(targetUserId, role);
  if (result.message) {
    res.status(200).json(result);
  } else {
    res.status(400).json({message: 'Failed to delete user'});
  }
};

export {getUser, getUserById, postUser, putUser, deleteUser};
