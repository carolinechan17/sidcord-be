const express = require('express');
const router = express.Router();
const model = require('../models/index');

//create new product
router.post('/', async function (req, res, next) {
  try {
    const { name, price, stock, sellerId } = req.body;
    const product = await model.products.create({ name, price, stock, sellerId });
    return res.send({
      code: 200,
      status: 'SUCCESS',
      data: {
        product,
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

//return products that belongs to seller with id
router.get('/:id', async function (req, res, next) {
  try {
    const id = req.params.id;
    const product = await model.products.findAll({ where: { sellerId: id } });
    return res.send({
      code: 200,
      status: 'SUCCESS',
      data: {
        product,
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

//update product with id
router.put('/:id', async function (req, res, next) {
  try {
    const id = req.params.id;
    const { name, price, stock, sellerId } = req.body;
    const product = await model.products.update({ name, price, stock, sellerId }, { where: { id: id } });
    return res.send({
      code: 200,
      status: 'SUCCESS',
      data: {
        product,
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

//delete product with id
router.delete('/:id', async function (req, res, next) {
  try {
    const id = req.params.id;
    const product = await model.products.destroy({ where: { id: id } });
    return res.send({
      code: 200,
      status: 'SUCCESS',
      data: {
        product,
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
