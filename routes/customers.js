const express = require('express');
const router = express.Router();
const model = require('../models/index');
const IsAuth = require('../middleware/IsAuth');

//create new customer
router.post('/', async function (req, res, next) {
  try {
    const { name, email, phone, uid, photoURL } = req.body;
    const customer = await model.customers.create({
      name,
      email,
      phone,
      photoURL,
      uid,
    });
    return res.send({
      code: 200,
      status: 'STATUS',
      data: {
        customer,
      },
    });
  } catch (err) {
    return res.send({
      code: 400,
      status: 'BAD_REQUEST',
      message: err.message,
    });
  }
});

//return customer data with id
router.get('/:uid', async function (req, res, next) {
  try {
    const uid = req.params.uid;
    const customer = await model.customers.findOne({ where: { uid: uid } });
    return res.send({
      code: 200,
      status: 'SUCCESS',
      data: {
        customer,
      },
    });
  } catch (err) {
    return res.send({
      code: 400,
      status: 'BAD_REQUEST',
      message: err.message,
    });
  }
});

//update profile customer
router.put('/:uid', IsAuth, async function (req, res, next) {
  try {
    const uid = req.params.uid;
    const { name, email, phone, bio } = req.body;
    const customer = await model.customers.update({ name, phone, bio }, { where: { uid: uid } });
    return res.send({
      code: 200,
      status: 'SUCCESS',
      data: {
        customer,
      },
    });
  } catch (err) {
    return res.send({
      code: 400,
      status: 'BAD_REQUEST',
      message: err.message,
    });
  }
});

//delete account customer
router.delete('/:id', IsAuth, async function (req, res, next) {
  try {
    const id = req.params.id;
    const customer = await model.customers.destroy({ where: { id: id } });
    return res.send({
      code: 200,
      status: 'SUCCESS',
      data: {
        customer,
      },
    });
  } catch (err) {
    return res.send({
      code: 400,
      status: 'BAD_REQUEST',
      message: err.message,
    });
  }
});

module.exports = router;
