const express = require('express')
const http = require('http')
const dotenv = require('dotenv');
const cors = require('cors')
const bodyParser = require('body-parser');
const path = require('path')
const responseTime = require('response-time');
const fs = require('fs')
const app = express();
const multer = require('multer');
const cloudinary = require('cloudinary');
const Estimator = require('./src/controllers/estimator')
const Activity= require('./src/controllers/activity')
const Users= require('./src/controllers/users')
const Projects= require('./src/controllers/projects')
const Analytics = require('./src/controllers/analytics');
const Analytics2 = require('./src/controllers/analytics2');




const Request = require('./src/middleware/requestlog')

app.use(cors())

http.createServer(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


dotenv.config();


app.use(express.static(path.join(__dirname, 'public')));


const storage = multer.diskStorage({
    distination: function (req, file, cb) {
      cb(null, './src');
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  });
  cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret,
  });
  const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/gif'||'image/png') {
      cb(null, true);
    } else {
      cb(new Error('image is not gif'), false);
    }
  };
  
  const upload = multer({
    storage,
    fileFilter,
  });
  

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    if (req.method === 'OPTIONS') {
      res.headers('Access-Control-Allow-Methods', 'POST, PUT, GET, DELETE');
      return res.status(200).json({});
    }
    next();
  });
  
  

     
app.get('/', function(req,res){
res.json({
    m:'sdg'
})
})

app.use('/api/v1/', Estimator);
app.use('/api/v1/users', Users);
app.use('/api/v1/projects', Projects);
app.use('/api/v1/analytics', Analytics);
app.use('/api/v2/analytics', Analytics2);


app.get('/api/v1/ggg/:id', Activity.getUser)
  
app.post('/api/v1/update2', upload.single('image'), (req, res) => {
    // console.log(req.body)
      cloudinary.uploader.upload(req.file.path, function (result) {
       //  console.log(result.secure_url)
         res.send({imgurl:result.secure_url})
        Activity.UpdateBeneficiary(req, res, result.secure_url);
       });
     });
  
    
module.exports = app;