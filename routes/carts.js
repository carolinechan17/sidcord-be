const express = require('express');
const router = express.Router();
const model = require('../models/index');
const IsAuth = require('../middleware/IsAuth');
const { op } = require('sequelize');

//add to cart with customer uid
router.post('/:uid', async function (req, res, next) {
  try {
    const uid = req.params.uid;
    //check apakah cart dengan uid dan status 0 sudah ada
    var cart = await model.carts.findOne({ where: { customerUID: uid, status: 0 } });
    //jika tidak, maka akan dibuat
    if (cart == null) {
      cart = await model.carts.create({
        customerUID: uid,
      });
    }
    const cartId = cart.id;
    const { name, slug, price, sellerUID, thumbnail, description } = req.body;
    //mengurangi stock dari produk (-1)
    const { stock } = await model.products.findOne({ where: { name: name } });
    const product = await model.products.update({ stock: stock - 1 }, { where: { name: name } });
    const cartItem = await model.cartItems.create({
      name,
      slug,
      price,
      sellerUID,
      thumbnail,
      description,
      cartId,
    });
    res.send({
      code: '200',
      status: 'SUCCESS',
      data: {
        cartItem,
      },
    });
  } catch (err) {
    res.status(err).send();
  }
});

//return cart data by uid
router.get('/:uid', IsAuth, async function (req, res, next) {
  try {
    const uid = req.params.uid;
    const cart = await model.carts.findOne({ where: { customerUID: uid } && { status: 0 } });
    return res.send({
      code: '200',
      status: 'SUCCESS',
      data: {
        cart,
      },
    });
  } catch (err) {
    res.status(err).send();
  }
});

//return all cartItem by cartId
router.get('/:id', IsAuth, async function (req, res, next) {
  try {
    const id = req.params.id;
    const cartItem = await model.cartItems.findAll({ where: { cartId: id } });
    return res.send({
      code: '200',
      status: 'SUCCESS',
      data: {
        cartItem,
      },
    });
  } catch (err) {
    res.status(err).send();
  }
});

//checkout by cartId
//pada checkout, customer akan mengisi data namaPenerima, email, phone,
router.put('/:id', IsAuth, async function (req, res, next) {
  try {
    const id = req.params.id;
    const totalPrice = await model.cartItem.sum({ price }, { where: { cartId: id } });
    const cart = await model.carts.update({ status: 1, totalPrice }, { where: { id: id } });
    return res.send({
      code: '200',
      status: 'SUCCESS',
      data: {
        cart,
      },
    });
  } catch (err) {
    res.status(err).send();
  }
});

module.exports = router;
