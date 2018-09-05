const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const usersRoutes = require('./routes/users');

const app = express();

mongoose.connect("mongodb+srv://" + process.env.MONGO_ATLAS_USER + ":" + process.env.MONGO_ATLAS_PW + "@meanapp-bsxii.mongodb.net/" + process.env.MONGO_ATLAS_DB + "?retryWrites=true", {useNewUrlParser: true}).then(() => {
  console.log('Succesfully connected to MongoDB')
}).catch((error) => {
  console.log(error);
  console.error('Connection to MongoDB is not successful')
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/', express.static(path.join(__dirname, 'dist')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', "*");
  res.setHeader('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept, authorization");
  res.setHeader('Access-Control-Allow-Methods', "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  next();
});

app.use("/api/users", usersRoutes);



app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"))
});

module.exports = app;
