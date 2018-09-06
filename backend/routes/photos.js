const express = require('express');
const router = express.Router();
const checkAuth = require('../middlewares/check-auth');
const fileInput = require('../middlewares/file');
const makeThumbnail = require('../middlewares/thumbnail');
const PhotosController = require('../controllers/photos');

router.get('', checkAuth, PhotosController.getPhotos);
router.get('/:id', checkAuth, PhotosController.getPhoto);
router.post('', checkAuth, fileInput, makeThumbnail, PhotosController.createPhoto);
router.put('/:id', checkAuth, fileInput, makeThumbnail, PhotosController.updatePhoto);
router.delete('/:id', checkAuth, PhotosController.deletePhoto);

module.exports = router;
