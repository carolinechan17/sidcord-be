const express = require('express');
const router = express.Router();
const model = require('../models/index');

//create new customer
router.post('/', async function (req, res, next) {
  try {
    const { name, email, password, phone } = req.body;
    const customer = await model.customers.create({ name, email, password, phone });
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
router.get('/:id', async function (req, res, next) {
  try {
    const id = req.params.id;
    const customer = await model.customers.findOne({ where: { id: id } });
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
router.put('/:id', async function (req, res, next) {
  try {
    const id = req.params.id;
    const { name, email, password, phone } = req.body;
    const customer = await model.customers.update({ name, email, password, phone }, { where: { id: id } });
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
router.delete('/:id', async function (req, res, next) {
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
