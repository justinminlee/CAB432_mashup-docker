const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const ejs = require('ejs');
const AWS = require('aws-sdk');
require("dotenv").config();


const indexRouter = require('./routes/index');
const recipeRouter = require('./routes/recipe');
const videoRouter = require('./routes/video')

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/', recipeRouter);
app.use('/', videoRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  console.log(err)
  res.render('error');
});

//upload count on s3
 AWS.config.update({
   region: process.env.AWS_REGION,
   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ,
   sessionToken: process.env.AWS_SESSION_TOKEN
 });

const s3 = new AWS.S3();

const bucketName = 'minjaeleebucket';
const fileName = 'visitors.json';

const params = {
    Bucket: bucketName,
    Key: fileName,
    Body: JSON.stringify({ visits: 0 }), // JSON object to be stored
    ContentType: 'application/json'
};

// Upload the file to S3
s3.upload(params, (err, data) => {
    if (err) {
        console.error('Error uploading file:', err);
    } else {
        console.log('File uploaded successfully:', data.Location);
    }
});


module.exports = app;
