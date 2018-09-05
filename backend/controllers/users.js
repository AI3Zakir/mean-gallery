const jwt = require('jsonwebtoken');
const Users = require('../models/user');

exports.createUser = (req, res, next) => {
  const user = new Users({
    email: req.body.email,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    birthDate: req.body.birthDate,
  });
  user.save()
    .then((result) => {
      const token = jwt.sign(
        {
          email: user.email,
          userId: user._id
        },
        process.env.JWT_KEY,
        {
          expiresIn: '1h'
        });
      res.status(201).json({
        message: 'Users Created',
        token: token,
        expiresIn: 3600,
        user: {
          _id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          birthDate: user.birthDate,
        }
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: 'Unable to create user with given credentials'
      })
    })
};

exports.loginUser = (req, res, next) => {
  let fetchedUser;
  Users.findOne({email: req.body.email})
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      fetchedUser = user;
      return user.comparePassword(req.body.password)
    })
    .then((result) => {
      if (!result) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }

      const token = jwt.sign(
        {
          email: fetchedUser.email,
          userId: fetchedUser._id
        },
        process.env.JWT_KEY,
        {
          expiresIn: '1h'
        });
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        user: {
          _id: fetchedUser._id,
          email: fetchedUser.email,
          firstName: fetchedUser.firstName,
          lastName: fetchedUser.lastName,
          birthDate: fetchedUser.birthDate,
        }
      });
    })
    .catch((error) => {
      return res.status(401).json({
        message: "Auth failed"
      });
    });
};
