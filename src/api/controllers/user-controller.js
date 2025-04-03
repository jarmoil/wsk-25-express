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
  const result = await modifyUser(req.body, req.params.id);
  if (result.message) {
    res.status(200);
    res.json(result);
  } else {
    res.sendStatus(400);
  }
};

const deleteUser = async (req, res) => {
  const result = await removeUser(req.params.id);
  if (result.message) {
    res.status(200);
    res.json(result);
  } else {
    res.sendStatus(400);
  }
};

export {getUser, getUserById, postUser, putUser, deleteUser};
