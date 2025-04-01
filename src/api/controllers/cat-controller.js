import {
  addCat,
  findCatById,
  listAllCats,
  updateCat,
  deleteCat as deleteCatModel,
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
  // Log form data and file data
  console.log('Form Data:', req.body);
  // Check if a file was uploaded
  if (!req.file) {
    return res.status(400).json({message: 'File upload is required.'});
  }
  console.log('File Data:', req.file);

  // Add the filename to the request body
  req.body.filename = req.file.filename;

  const result = await addCat(req.body);
  if (result.cat_id) {
    res.status(201).json({message: 'New cat added.', result});
  } else {
    res.sendStatus(400);
  }
};

const putCat = async (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;
  const result = await updateCat(id, updatedData);
  if (result.updatedCat) {
    res.status(200).json(result);
  } else {
    res.status(404).json(result);
  }
};

const deleteCat = async (req, res) => {
  const id = req.params.id;
  const result = await deleteCatModel(id);

  if (result.deletedCat) {
    res.status(200).json(result);
  } else {
    res.status(404).json(result);
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
