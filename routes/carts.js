const express = require('express');
const router = express.Router();
const model = require('../models/index');
const IsAuth = require('../middleware/IsAuth');

//add to cart
router.post('/:uid', async function (req, res, next) {
  try {
    const uid = req.params.uid;
    const cart = await model.carts.findOne({ where: { customerUID: uid } && { status: 0 } });
    if (cart == null) {
      cart = await model.carts.create({
        totalPrice: 0,
        status: 0,
      });
    }
    const { name, slug, price, sellerUID, thumbnail, description } = req.body;
    const { stock } = await model.products.findOne({ where: { name: name } });
    const product = await model.products.update({ stock: stock - 1 }, { where: { name: name } });
    const cartItem = await model.cartItems.create({
      name,
      slug,
      price,
      sellerUID,
      thumbnail,
      description,
      cartId: cart.id,
    });
    res.send({
      code: '200',
      status: 'SUCCESS',
      data: {
        cartItem,
        product,
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
