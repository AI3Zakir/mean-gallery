const express = require('express');
const router = express.Router();
const checkAuth = require('../middlewares/check-auth');
const AlbumsController = require('../controllers/albums');

router.get('', checkAuth, AlbumsController.getAlbums);
router.get('/:id', checkAuth, AlbumsController.getAlbum);
router.post('', checkAuth, AlbumsController.createAlbum);
router.put('/:id', checkAuth, AlbumsController.updateAlbum);
router.delete('/:id', checkAuth, AlbumsController.deleteAlbum);

module.exports = router;
