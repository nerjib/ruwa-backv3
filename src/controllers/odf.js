const express = require('express');
const moment = require ('moment')
const request = require('request');
const router = express.Router();
const db = require('../db/index');










router.post('/', async (req, res) => {
    const createUser = `INSERT INTO odf(no_of_communities) VALUES ($1) RETURNING *`;
  const values = [
  req.body.phase
  ];
  try {
  const { rows } = await db.query(createUser, values);
  // console.log(rows);
 // await pushtoken(req.body.lga+' '+req.body.ward+' '+req.body.newcommunity, 'sanitation')

  return res.status(201).send(rows);
  } catch (error) {
  return res.status(400).send(error);
  }  
  });

  router.get('/', async (req, res) => {
    const getAllQ = 'SELECT * FROM odf';
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
  router.get('/details/:id', async (req, res) => {
    const getAllQ = 'SELECT * FROM odf where id=$1';
    try {
      // const { rows } = qr.query(getAllQ);
      const { rows } = await db.query(getAllQ,[req.params.id]);
      return res.status(201).send(rows);
    } catch (error) {
      if (error.routine === '_bt_check_unique') {
        return res.status(400).send({ message: 'User with that EMAIL already exist' });
      }
      return res.status(400).send(`${error} jsh`);
    }
  });  

  


module.exports = router;
