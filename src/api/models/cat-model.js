import promisePool from '../../utils/database.js';

const listAllCats = async () => {
  const [rows] = await promisePool.execute(
    'SELECT wsk_cats.*, wsk_users.name as "owner_name" FROM wsk_cats JOIN wsk_users ON wsk_cats.owner = wsk_users.user_id'
  );
  console.log('rows', rows);
  return rows;
};

const findCatById = async (id) => {
  const [rows] = await promisePool.execute(
    'SELECT wsk_cats.*, wsk_users.name as "owner_name" FROM wsk_cats JOIN wsk_users ON wsk_cats.owner = wsk_users.user_id WHERE cat_id = ?',
    [id]
  );
  console.log('rows', rows);
  if (rows.length === 0) {
    return false;
  }
  return rows[0];
};

const addCat = async (cat) => {
  const {cat_name, weight, owner, filename, birthdate} = cat;
  const sql = `INSERT INTO wsk_cats (cat_name, weight, owner, filename, birthdate)
               VALUES (?, ?, ?, ?, ?)`;
  const params = [cat_name, weight, owner, filename, birthdate];
  const rows = await promisePool.execute(sql, params);
  console.log('rows', rows);
  if (rows[0].affectedRows === 0) {
    return false;
  }
  return {cat_id: rows[0].insertId};
};

const modifyCat = async (cat, id, userId, role) => {
  try {
    let sql;
    if (role === 'admin') {
      sql = promisePool.format(`UPDATE wsk_cats SET ? WHERE cat_id = ?`, [
        cat,
        id,
      ]);
    } else {
      sql = promisePool.format(
        `UPDATE wsk_cats SET ? WHERE cat_id = ? AND owner = ?`,
        [cat, id, userId]
      );
    }
    const [rows] = await promisePool.execute(sql);
    if (rows.affectedRows === 0) {
      return false;
    }
    return {message: 'success'};
  } catch (error) {
    console.error('Error in modifyCat:', error);
    throw error;
  }
};

const removeCat = async (id, userId, role) => {
  try {
    let sql;
    if (role === 'admin') {
      sql = `DELETE FROM wsk_cats WHERE cat_id = ?`;
    } else {
      sql = `DELETE FROM wsk_cats WHERE cat_id = ? AND owner = ?`;
    }
    const [rows] = await promisePool.execute(sql, [id, userId]);
    if (rows.affectedRows === 0) {
      return false;
    }
    return {message: 'success'};
  } catch (error) {
    console.error('Error in removeCat:', error);
    throw error;
  }
};

const findCatByOwnerId = async (ownerId) => {
  const [rows] = await promisePool.execute(
    `SELECT wsk_cats.*, wsk_users.name as owner_name
     FROM wsk_cats
     JOIN wsk_users ON wsk_cats.owner = wsk_users.user_id
     WHERE wsk_users.user_id = ?`,
    [ownerId]
  );
  return rows;
};

export {
  listAllCats,
  findCatById,
  addCat,
  modifyCat,
  removeCat,
  findCatByOwnerId,
};
