const Photo = require('../models/photo');

exports.createPhoto = (req, res, next) => {
  const photo = new Photo({
    title: req.body.title,
    image: "/uploads/photos/" + req.file.filename,
    thumbnail: "/uploads/thumbnails/" + req.file.thumbnail,
    parentId: req.body.parentId,
    userId: req.userData.userId
  });
  photo.save()
    .then((result) => {
      res.status(201).json({
        message: 'Photo uploaded',
        photo: result
      });
    })
    .catch((error) => {
      rest.status(500).json({
        message: 'Uploading of photo failed'
      })
    });
};
exports.getPhotos = (req, res, next) => {
  const parentId = req.query.parentId;
  let photoQuery = Photo.find({userId: req.userData.userId, parentId: parentId});

  photoQuery.find()
    .then((photos) => {
      res.status(200).json({
        message: 'Photos successfully fetched',
        photos: photos
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: 'Fetching photos failed'
      });
    });
};
exports.getPhoto = (req, res, next) => {
  Photo.findById(req.params.id)
    .then((photo) => {
      if (photo) {
        res.status(200).json(photo);
      } else {
        res.status(404).json({
          message: 'Photo not found'
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: 'Fetching photo failed'
      });
    });
};
exports.updatePhoto = (req, res, next) => {
  let image = req.body.image;
  let thumbnail = req.body.thumbnail;
  if (req.file) {
    image = "/uploads/photos/" + req.file.filename;
    thumbnail = "/uploads/thumbnails/" + req.file.thumbnail;
  }
  const photo = new Photo({
    _id: req.params.id,
    title: req.body.title,
    parentId: req.body.parentId,
    image: image,
    thumbnail: thumbnail,
    userId: req.userData.userId
  });
  Photo.findOneAndUpdate({_id: req.params.id, userId: req.userData.userId}, photo)
    .then((result) => {
      if (result === 0) {
        res.status(401).json({
          message: 'Not authorized.'
        })
      } else {
        res.status(200).json({
          message: 'Photo updated',
          photo: photo
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: 'Photo not updated'
      })
    });
};
exports.deletePhoto = (req, res, next) => {
  Photo.deleteOne({_id: req.params.id, userId: req.userData.userId})
    .then((result) => {
      if (result.n > 0) {
        res.status(200).json({
          message: 'Photo Deleted',
        });
      } else {
        res.status(401).json({
          message: 'Not authorized.'
        })
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: 'Photo not deleted.'
      })
    });
};
