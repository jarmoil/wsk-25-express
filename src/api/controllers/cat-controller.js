import {
  addCat,
  findCatById,
  listAllCats,
  modifyCat,
  removeCat,
  findCatByOwnerId,
} from '../models/cat-model.js';

const getCat = async (req, res) => {
  res.json(await listAllCats());
};

const getCatById = async (req, res) => {
  const cat = await findCatById(req.params.id);
  if (cat) {
    res.json(cat);
  } else {
    res.sendStatus(404);
  }
};

const postCat = async (req, res) => {
  req.body.filename = req.file.filename;
  const result = await addCat(req.body);
  if (result.cat_id) {
    res.status(201);
    res.json(result);
  } else {
    res.sendStatus(400);
  }
};

const putCat = async (req, res) => {
  const {user_id, role} = res.locals.user; // Extract user info from token
  const catId = parseInt(req.params.id, 10);

  // Allow only the owner or an admin to update
  const result = await modifyCat(req.body, catId, user_id, role);
  if (result.message) {
    res.status(200).json(result);
  } else {
    res.status(403).json({message: 'Forbidden: Cannot modify this cat'});
  }
};

const deleteCat = async (req, res) => {
  const {user_id, role} = res.locals.user; // Extract user info from token
  const catId = parseInt(req.params.id, 10);

  // Allow only the owner or an admin to delete
  const result = await removeCat(catId, user_id, role);
  if (result.message) {
    res.status(200).json(result);
  } else {
    res.status(403).json({message: 'Forbidden: Cannot delete this cat'});
  }
};

const getCatByOwnerId = async (req, res) => {
  const ownerId = req.params.id;
  const cats = await findCatByOwnerId(ownerId);
  if (cats.length > 0) {
    res.json(cats);
  } else {
    res.status(404).json({message: 'No cats found for this owner.'});
  }
};

export {getCat, getCatById, postCat, putCat, deleteCat, getCatByOwnerId};
