import {
  listAllUsers,
  findUserById,
  addUser,
  updateUser,
  deleteUser as deleteUserModel,
} from '../models/user-model.js';

const getUser = (req, res) => {
  res.json(listAllUsers());
};

const getUserById = (req, res) => {
  const user = findUserById(req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.sendStatus(404);
  }
};

const postUser = (req, res) => {
  const result = addUser(req.body);
  if (result.user_id) {
    res.status(201);
    res.json({message: 'New user added.', result});
  } else {
    res.sendStatus(400);
  }
};
const putUser = (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;
  const result = updateUser(id, updatedData);
  if (result.updatedUser) {
    res.status(200).json(result);
  } else {
    res.status(404).json(result);
  }
};

const deleteUser = (req, res) => {
  const id = req.params.id;
  const result = deleteUserModel(id);
  if (result.deletedUser) {
    res.status(200).json(result);
  } else {
    res.status(404).json(result);
  }
};

export {getUser, getUserById, postUser, putUser, deleteUser};
