const userItems = [
  {
    user_id: 3609,
    name: 'John Doe',
    username: 'johndoe',
    email: 'john@metropolia.fi',
    role: 'user',
    password: 'password',
  },
  {
    user_id: 3608,
    name: 'Jane Doe',
    username: 'janedoe',
    email: 'jane@metropolia.fi',
    role: 'admin',
    password: 'password',
  },
];

const listAllUsers = () => {
  return userItems;
};

const findUserById = (id) => {
  return userItems.find((item) => item.user_id == id);
};

const addUser = (user) => {
  const {name, username, email, role, password} = user;
  const newId = userItems[0].user_id + 1;
  userItems.unshift({
    user_id: newId,
    name,
    username,
    email,
    role,
    password,
  });
  return {user_id: newId};
};

const updateUser = (id, updatedData) => {
  if (isNaN(id)) {
    return {message: 'Invalid ID format. ID must be a number.'};
  }
  const userIndex = userItems.findIndex((item) => item.user_id == id);
  if (userIndex !== -1) {
    userItems[userIndex] = {
      ...userItems[userIndex],
      ...updatedData,
    };
    return {message: 'User item updated', updateUser: userItems[userIndex]};
  } else {
    return {message: 'User not found'};
  }
};

const deleteUser = (id) => {
  if (isNaN(id)) {
    return {message: 'Invalid ID format. ID must be a number.'};
  }

  const userIndex = userItems.findIndex((item) => item.user_id == id);
  if (userIndex !== -1) {
    const deletedUser = userItems.splice(userIndex, 1);
    return {message: 'User deleted successfully.', deletedUser: deletedUser[0]};
  } else {
    return {message: 'User not found.'};
  }
};

export {listAllUsers, findUserById, addUser, updateUser, deleteUser};
