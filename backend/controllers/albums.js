const Album = require('../models/album');

exports.createAlbum = (req, res, next) => {
  const album = new Album({
    title: req.body.title,
    parentId: req.body.parentId,
    userId: req.userData.userId
  });
  album.save()
    .then((result) => {
      res.status(201).json({
        message: 'Album uploaded',
        album: result
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: 'Uploading of album failed'
      })
    });
};
exports.getAlbums = (req, res, next) => {
  const albumQuery = Album.find({userId: req.userData.userId});
  albumQuery.find()
    .then((albums) => {
      res.status(200).json({
        message: 'Albums successfully fetched',
        albums: albums
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: 'Fetching albums failed'
      });
    });
};
exports.getAlbum = (req, res, next) => {
  Album.findById(req.params.id)
    .then((album) => {
      if (album) {
        res.status(200).json(album);
      } else {
        res.status(404).json({
          message: 'Album not found'
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: 'Fetching album failed'
      });
    });
};
exports.updateAlbum = (req, res, next) => {
  const album = new Album({
    _id: req.params.id,
    title: req.body.title,
    parentId: req.body.parentId,
    userId: req.userData.userId
  });
  Album.findOneAndUpdate({_id: req.params.id, userId: req.userData.userId}, album)
    .then((result) => {
      if (result === 0) {
        res.status(401).json({
          message: 'Not authorized.'
        })
      } else {
        res.status(200).json({
          message: 'Album updated',
          album: album
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: 'Album not updated'
      })
    });
};
exports.deleteAlbum = (req, res, next) => {
  Album.deleteOne({_id: req.params.id, userId: req.userData.userId})
    .then((result) => {
      if (result.n > 0) {
        res.status(200).json({
          message: 'Album Deleted',
        });
      } else {
        res.status(401).json({
          message: 'Not authorized.'
        })
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: 'Album not deleted.'
      })
    });
};
