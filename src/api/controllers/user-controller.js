import {
  listAllUsers,
  findUserById,
  addUser,
  updateUser,
  deleteUser as deleteUserModel,
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
  req.body.password = bcrypt.hashSync(req.body.password, 10);
  req.body.filename = req.file.filename;

  const result = await addUser(req.body);
  if (result.user_id) {
    res.status(201);
    res.json({message: 'New user added.', result});
  } else {
    res.sendStatus(400);
  }
};
const putUser = async (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;
  const result = await updateUser(id, updatedData);
  if (result.updatedUser) {
    res.status(200).json(result);
  } else {
    res.status(404).json(result);
  }
};

const deleteUser = async (req, res) => {
  const id = req.params.id;
  const result = await deleteUserModel(id);
  if (result.deletedUser) {
    res.status(200).json(result);
  } else {
    res.status(404).json(result);
  }
};

export {getUser, getUserById, postUser, putUser, deleteUser};
