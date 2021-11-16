const express = require('express');
const IsAuth = require('../middleware/IsAuth');
const IsSeller = require('../middleware/IsSeller');
const router = express.Router();
const model = require('../models/index');
const admin = require('../admin');

//create new seller
router.post('/', IsAuth, async function (req, res, next) {
  const { name, email, phone, uid, photoURL } = req.body;

  const seller = await model.sellers.create({
    name,
    email,
    phone,
    photoURL,
    uid,
  });

  return await admin
    .auth()
    .setCustomUserClaims(uid, { seller: true })
    .then(() => {
      console.log('SUCCESS');
      res.send({
        code: 200,
        status: 'STATUS',
        data: {
          seller,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      return res.send({
        code: 400,
        status: 'BAD_REQUEST',
        message: err.message,
      });
    });
});

router.get('/get/products', IsSeller, async function (req, res, next) {
  try {
    const { uid } = req.body;
    const product = await model.products.findAll({
      where: { sellerUID: uid },
    });
    return res.send({
      code: 200,
      status: 'SUCCESS',
      data: {
        product,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(400).send({
      code: 400,
      status: 'BAD_REQUEST',
      message: err.message,
    });
  }
});

//return seller data with id
router.get('/:uid', async function (req, res, next) {
  try {
    const uid = req.params.uid;
    const seller = await model.sellers.findOne({
      where: { uid: uid },
      include: 'products',
    });
    return res.send({
      code: 200,
      status: 'SUCCESS',
      data: {
        seller,
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

//update profile seller
router.put('/:id', async function (req, res, next) {
  try {
    const id = req.params.id;
    const { name, email, password, phone } = req.body;
    const seller = await model.sellers.update({ name, email, password, phone }, { where: { id: id } });
    return res.send({
      code: 200,
      status: 'SUCCESS',
      data: {
        seller,
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

//delete account seller
router.delete('/:id', async function (req, res, next) {
  try {
    const id = req.params.id;
    const seller = await model.sellers.destroy({ where: { id: id } });
    return res.send({
      code: 200,
      status: 'SUCCESS',
      data: {
        seller,
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

//show all cartItems that belongs to seller with sellerUID
router.get('/cartItems/:uid', async function (req, res, next) {
  try {
    const sellerUID = req.params.uid;
    const carts = await model.carts.findAll({ include: [cartItems] }, { where: { sellerUID: sellerUID } });
    return res.send({
      code: 200,
      status: 'SUCCESS',
      data: {
        carts,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

//update status pesanan berdasarkan cartId
router.get('/:id', IsSeller, async function (req, res, next) {
  try {
    const cartId = req.params.id;
    const carts = await model.carts.update({ status: 2 }, { where: { cartId: cartId } });
    return res.send({
      code: 200,
      status: 'SUCCESS',
      data: {
        carts,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

module.exports = router;
