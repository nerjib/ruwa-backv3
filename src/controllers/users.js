const express = require('express');
const moment = require('moment')
const db = require('../db/index');

//const db = require('../dbs/index');

const router = express.Router();

router.get('/', async (req, res) => {
  const getAllQ = 'SELECT * FROM users';
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

router.get('/hh', async (req, res) => {
  
    return res.status(201).send('rows');
 
});


router.get('/userid/:id', async (req, res) => {
  const getAllQ = 'SELECT * FROM users where id=$1';
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


router.post('/', async (req, res) => {
    const createUser = `INSERT INTO
    users (name)
    VALUES ($1) RETURNING *`;
  
  const values = [
  req.body.name 
  ];
  try {
  const { rows } = await db.query(createUser, values);
  // console.log(rows);
  const data = {
    status: 'success',
    data: {
      message: 'User added successfully​',
      name: rows[0].name,
    
    },
  };
  return res.status(201).send(data);
  } catch (error) {
  return res.status(400).send(error);
  }
  });
  

module.exports = router;

