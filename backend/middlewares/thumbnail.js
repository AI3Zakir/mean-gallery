const thumb = require('node-thumbnail').thumb;

module.exports = (req, res, next) => {
  try {
    thumb({
      source: 'backend/uploads/photos/' + req.file.filename, // could be a filename: dest/path/image.jpg
      destination: 'backend/uploads/thumbnails',
      concurrency: 4,
      width: 250
    }, function(files, err, stdout, stderr) {
      req.file.thumbnail = files.pop().dstPath.split('/').pop();
      next();
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error creating thumbnail'
    });
  }
};
