import promisePool from '../../utils/database.js';

const listAllUsers = async () => {
  const [rows] = await promisePool.execute('SELECT * FROM wsk_users');
  console.log('rows', rows);
  return rows;
};

const findUserById = async (id) => {
  const [rows] = await promisePool.execute(
    'SELECT * FROM wsk_users WHERE user_id = ?',
    [id]
  );
  console.log('rows', rows);
  if (rows.length === 0) {
    return false;
  }
  return rows[0];
};

const addUser = async (user) => {
  try {
    const {name, username, password, email} = user;
    console.log('user', user);

    const sql = `INSERT INTO wsk_users (name, username, password, email)
                 VALUES (?, ?, ?, ?)`;
    const params = [name, username, password, email];
    const [rows] = await promisePool.execute(sql, params);

    console.log('rows', rows);
    if (rows.affectedRows === 0) {
      return false;
    }
    return {user_id: rows.insertId};
  } catch (error) {
    console.error('Error in addUser:', error);
    throw error; // Re-throw the error to be caught in the controller
  }
};

const modifyUser = async (user, id, role) => {
  try {
    let sql;
    if (role === 'admin') {
      sql = promisePool.format(`UPDATE wsk_users SET ? WHERE user_id = ?`, [
        user,
        id,
      ]);
    } else {
      sql = promisePool.format(
        `UPDATE wsk_users SET ? WHERE user_id = ? AND user_id = ?`,
        [user, id, id]
      );
    }
    const [rows] = await promisePool.execute(sql);
    if (rows.affectedRows === 0) {
      return false;
    }
    return {message: 'success'};
  } catch (error) {
    console.error('Error in modifyUser:', error);
    throw error;
  }
};

const removeUser = async (id, role) => {
  try {
    let sql;
    if (role === 'admin') {
      sql = `DELETE FROM wsk_users WHERE user_id = ?`;
    } else {
      sql = `DELETE FROM wsk_users WHERE user_id = ? AND user_id = ?`;
    }
    const [rows] = await promisePool.execute(sql, [id, id]);
    if (rows.affectedRows === 0) {
      return false;
    }
    return {message: 'success'};
  } catch (error) {
    console.error('Error in removeUser:', error);
    throw error;
  }
};

const login = async (username) => {
  try {
    const sql = `SELECT * FROM wsk_users WHERE username = ?`;
    const [rows] = await promisePool.execute(sql, [username]);

    if (rows.length === 0) {
      return false;
    }
    return rows[0];
  } catch (error) {
    console.error('Error in login:', error);
    throw error;
  }
};

export {listAllUsers, findUserById, addUser, modifyUser, removeUser, login};
