const express = require('express');
const router = express.Router();
const db = require('../db/index');
const moment = require('moment')







router.get('/', async (req, res) => {
    const getAllQ = `SELECT projects.title, projects.community, projects.ward, projects.lga, usdfeedback.fid, usdfeedback.fault, usdfeedback.time, usdfeedback.sender FROM usdfeedback left join projects on usdfeedback.fid=projects.fid`;
    try {
      // const { rows } = qr.query(getAllQ);
      const { rows } = await db.query(getAllQ);
      return res.status(201).send(rows);
    } catch (error) {
      if (error.routine === '_bt_check_unique') {
        return res.status(400).send({ message: 'User with that EMAIL already exist' });
      }
      return res.status(400).send(`${error} jsh`);
    }
  });



let myDetails={
    fid:'',
    lang: '',
    facility:'',
    fault:''
  }
  
  router.post('/', async(req,res) => {
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
    const createFeedback = `INSERT INTO   usdfeedback(fid,fault,sender,time) VALUES ($1,$2,$3,$4) RETURNING *`;
    const values = [
    myDetails.fid,
    lastData,
    phoneNumber,
    moment(new Date())
];
    try {
    const { rows } = await db.query(createFeedback, values);
  
    } catch (error) {
 message(error)
    }  
    message = `END Mun gode da wannan bayanin akan ${myDetails.facility}
     ID: ${myDetails.fid}
     maatsala: ${lastData}  `
  }else if (text===`2*2*${myDetails.fid}*${lastData==='1'?'1':lastData==='2'?'2':lastData==='3'?'3':lastData==='4'?'4':lastData==='5'?'5':lastData==='6'?'6':'7'}`){
    const createFeedback = `INSERT INTO   usdfeedback(fid,fault,sender,time) VALUES ($1,$2,$3,$4) RETURNING *`;
    const values = [
    myDetails.fid,
    lastData,
    phoneNumber,
    moment(new Date())
];
    try {
    const { rows } = await db.query(createFeedback, values);
  
    } catch (error) {
 message(error)
    }     
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
  
    const createFeedback = `INSERT INTO   usdfeedback(fid,fault,sender,time) VALUES ($1,$2,$3,$4) RETURNING *`;
    const values = [
    myDetails.fid,
    lastData,
    phoneNumber,
    moment(new Date())
];
    try {
    const { rows } = await db.query(createFeedback, values);
  
    } catch (error) {
 message(error)
    }  
    message = `END Thanks for your feedback on ${myDetails.facility}
    ID: ${myDetails.fid}
    Problem: ${lastData}  `
  }else if (text===`1*2*${myDetails.fid}*${lastData==='1'?'1':lastData==='2'?'2':lastData==='3'?'3':lastData==='4'?'4':lastData==='5'?'5':lastData==='6'?'6':'7'}`){
  
    const createFeedback = `INSERT INTO   usdfeedback(fid,fault,sender,time) VALUES ($1,$2,$3,$4) RETURNING *`;
    const values = [
    myDetails.fid,
    lastData,
    phoneNumber,
    moment(new Date())
];
    try {
    const { rows } = await db.query(createFeedback, values);
  
    } catch (error) {
 message(error)
    }  
  
  
  
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



  


module.exports = router;
