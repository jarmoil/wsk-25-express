import {
  addCat,
  findCatById,
  listAllCats,
  updateCat,
  deleteCat as deleteCatModel,
} from '../models/cat-model.js';

const getCat = (req, res) => {
  res.json(listAllCats());
};

const getCatById = (req, res) => {
  const cat = findCatById(req.params.id);
  if (cat) {
    res.json(cat);
  } else {
    res.sendStatus(404);
  }
};

const postCat = (req, res) => {
  // Log form data and file data
  console.log('Form Data:', req.body);
  // Check if a file was uploaded
  if (!req.file) {
    return res.status(400).json({message: 'File upload is required.'});
  }
  console.log('File Data:', req.file);

  // Add the filename to the request body
  req.body.filename = req.file.filename;

  const result = addCat(req.body);
  if (result.cat_id) {
    res.status(201).json({message: 'New cat added.', result});
  } else {
    res.sendStatus(400);
  }
};

const putCat = (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;
  const result = updateCat(id, updatedData);
  if (result.updatedCat) {
    res.status(200).json(result);
  } else {
    res.status(404).json(result);
  }
};

const deleteCat = (req, res) => {
  const id = req.params.id;
  const result = deleteCatModel(id);

  if (result.deletedCat) {
    res.status(200).json(result);
  } else {
    res.status(404).json(result);
  }
};

export {getCat, getCatById, postCat, putCat, deleteCat};
