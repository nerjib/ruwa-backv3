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
//const Activity= require('./src/controllers/activity')
const Users= require('./src/controllers/users')
const Projects= require('./src/controllers/projects')
const Analytics = require('./src/controllers/analytics');
const Analytics2 = require('./src/controllers/analytics2');
const Activity = require('./src/controllers/activitiesform')
const ChangeOfLocation = require('./src/controllers/changeLocation')
const Contractors = require('./src/controllers/contractors');
const Monitors = require('./src/controllers/monitors')
const MonitorsRep = require('./src/controllers/monitorsReport')
const Phases = require('./src/controllers/phases')
const Training = require('./src/controllers/training')
const Reports = require('./src/controllers/reports');
const Update = require('./src/controllers/updates')
const VLC = require('./src/controllers/vlc')
const SupaInfo = require('./src/controllers/supervisorinfo')
const USSD = require('./src/controllers/ussd')




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

app.use('/api/v1/ussd', USSD);
app.use('/api/v1/', Estimator);
app.use('/api/v1/users', Users);
app.use('/api/v1/projects', Projects);
app.use('/api/v1/analytics', Analytics);
app.use('/api/v2/analytics', Analytics2);
app.use('/api/v1/changeoflocation', ChangeOfLocation);
app.use('/api/v1/contractors', Contractors);
app.use('/api/v1/monitors', Monitors);
app.use('/api/v1/monitorsreports', MonitorsRep);
app.use('/api/v1/phases', Phases);
app.use('/api/v1/training', Training);
app.use('/api/v1/reports', Reports);
app.use('/api/v1/vlc', VLC);
app.use('/api/v1/update', Update);
app.use('/api/v1/superinfo', SupaInfo);






// ussd feedback

let myDetails={
  fid:'',
  lang: '',
  facility:'',
  fault:''
}

app.post('/newsms', function(req,res){
  const { sessionId, serviceCode, phoneNumber, text } = req.body;

  var webURL = 'http://kadruwassa.ng'
  var welcomeMsg = `CON Select language/ Zabi yare 
  1. English
  2. Hausa`;


  var textValue = text.split('*').length
  var message = ""
  var lastData = text.split('*')[textValue-1];


let response = "";
if(text === ''){
message = welcomeMsg

}else if(text==='2'){
  myDetails.lang= 'Hausa'
  message = `CON Wani irin famfo ne? 
  1. famfon tuka-tuka
  2. famfon sola`
}else if (text==='2*1'||text==='2*2'){
  myDetails.facility=lastData==='1'?'famfon tuka-tuka':'famfon sola'
  message = 'CON Saka Lamban famfo'
}else if (text===`2*1*${lastData}`||text===`2*2*${lastData}`){
    myDetails.fid=lastData
   message = `CON Menene matsalan famfo
  1. Baya aiki gaba daya
  2. Famfo baya bada wadataccen ruwa
  3. Ruwa baya taruwa a tanki
  4. Tuka-tuka na wahalar bugawa
  5. Bututun ruwa ya fashe
  6. Allon sola ya fita
  7. wani matsala daban` 
}else if (text===`2*1*${myDetails.fid}*${lastData==='1'?'1':lastData==='2'?'2':lastData==='3'?'3':lastData==='4'?'4':lastData==='5'?'5':lastData==='6'?'6':'7'}`){
 
  message = `END Mun gode da wannan bayanin akan ${myDetails.facility}
   ID: ${myDetails.fid}
   maatsala: ${lastData}  `
}else if (text===`2*2*${myDetails.fid}*${lastData==='1'?'1':lastData==='2'?'2':lastData==='3'?'3':lastData==='4'?'4':lastData==='5'?'5':lastData==='6'?'6':'7'}`){
  message = `END Mun gode da wannan bayanin akan ${myDetails.facility}
  ID: ${myDetails.fid}
  Matsala: ${lastData}  `
}else if (text === '1'){
  message = `CON Select facility type
  1. Hand pump borehole
  2. Solar motorized borehole`
}else if (text==='1*1'||text==='1*2'){
  myDetails.facility=lastData==='1'?'Hand pump borehole':'Solar motorized borehole'

  message = 'CON Input facility code'
}else if (text===`1*1*${lastData}`||text===`1*2*${lastData}`){
  myDetails.fid=lastData
  message = `CON What is the problem?
  1. Not working completely
  2. Low yield
  3. Water not pumpimg to tank
  4. Hard to pump
  5. Leaking pipe
  6. Solar panel vandalized

  7. others`
}else if (text===`1*1*${myDetails.fid}*${lastData==='1'?'1':lastData==='2'?'2':lastData==='3'?'3':lastData==='4'?'4':lastData==='5'?'5':lastData==='6'?'6':'7'}`){
  message = `END Thanks for your feedback on ${myDetails.facility}
  ID: ${myDetails.fid}
  Problem: ${lastData}  `
}else if (text===`1*2*${myDetails.fid}*${lastData==='1'?'1':lastData==='2'?'2':lastData==='3'?'3':lastData==='4'?'4':lastData==='5'?'5':lastData==='6'?'6':'7'}`){
  message = `END Thanks for your feedback on ${myDetails.facility}
  ID: ${myDetails.fid}
  Problem: ${lastData}  `
}
else{
  message = 'END wrong selection'
}

// Print the response onto the page so that our SDK can read it
res.set("Content-Type: text/plain");
res.send(message);
// DONE!!!
})

//app.get('/api/v1/ggg/:id', Activity.getUser)
  
app.post('/api/v1/update2', upload.single('image'), (req, res) => {
    // console.log(req.body)
      cloudinary.uploader.upload(req.file.path, function (result) {
       //  console.log(result.secure_url)
         res.send({imgurl:result.secure_url})
        Activity.UpdateBeneficiary(req, res, result.secure_url);
       });
     });
  
     app.post('/api/v1/activityform', upload.single('image'), (req, res) => {
      // console.log(req.body)
        cloudinary.uploader.upload(req.file.path, function (result) {
           console.log(result.secure_url)
          // res.send({imgurl:result.secure_url})
          Activity.createReport(req, res, result.secure_url);
         });
       });
       
       app.post('/api/v1/weeklyactivityform', upload.single('image'), (req, res) => {
         // console.log(req.body)
           cloudinary.uploader.upload(req.file.path, function (result) {
              console.log(result.secure_url)
             // res.send({imgurl:result.secure_url})
             Activity.createWeeklyReport(req, res, result.secure_url);
            });
          });
        
       app.post('/api/v1/upload', upload.single('image'), (req, res) => {
        // console.log(req.body)
          cloudinary.uploader.upload(req.file.path, function (result) {
           //  console.log(result.secure_url)
             res.send({imgurl:result.secure_url})
         //   Activity.createReport(req, res, result.secure_url);
           },{ resource_type: "auto" });
         });
       
     app.post('/api/v1/activityform1', (req, res) => {
          Activity.createActivity(req, res);
       });
     
       app.post('/api/v1/weeklyactivityform1', (req, res) => {
         Activity.createWeeklyActivity(req, res);
      });
     
     //Change daily report image
      app.post('/api/v1/updatedailyreport', upload.single('image'), (req, res) => {
       // console.log(req.body)
         cloudinary.uploader.upload(req.file.path, function (result) {
            console.log(result.secure_url)
           // res.send({imgurl:result.secure_url})
           Activity.UpdateDailyReport(req, res, result.secure_url);
          },{ resource_type: "auto" });
        });
     
        app.post('/api/v1/updateweeklyreport', upload.single('image'), (req, res) => {
         // console.log(req.body)
           cloudinary.uploader.upload(req.file.path, function (result) {
              console.log(result.secure_url)
             // res.send({imgurl:result.secure_url})
             Activity.UpdateWeeklyReport(req, res, result.secure_url);
            });
          });
       
     
    
module.exports = app;