const express = require("express");
const router = express.Router();
const model = require("../models/index");
const IsAuth = require("../middleware/IsAuth");

//add to cart with customer id
router.post("/:id", IsAuth, async function (req, res, next) {
  try {
    const id = req.params.id;
    const { productId, customerId, quantity, totalPrice } = req.body;
    const cart = await model.carts.create({
      productId,
      customerId,
      quantity,
      totalPrice,
    });
    return res.send({
      code: "200",
      status: "SUCCESS",
      data: {
        cart,
      },
    });
  } catch (err) {
    return res.send({
      code: "400",
      status: "BAD_REQUEST",
      message: err.message,
    });
  }
});

//increment one specific item with id
router.put("/:id", IsAuth, async function (req, res, next) {
  try {
    const productId = req.params.id;
    const quantity = quantity - 1;
    const cart = await model.carts.update(
      { quantity },
      { where: { productId: productId } }
    );
    return res.send({
      code: "200",
      status: "SUCCESS",
      data: {
        cart,
      },
    });
  } catch (err) {
    return res.send({
      code: "400",
      status: "BAD_REQUEST",
      message: err.message,
    });
  }
});

//decrement one specific item with id
router.put("/:id", IsAuth, async function (req, res, next) {
  try {
    const productId = req.params.id;
    const quantity = quantity + 1;
    const cart = await model.carts.update(
      { quantity },
      { where: { productId: productId } }
    );
    return res.send({
      code: "200",
      status: "SUCCESS",
      data: {
        cart,
      },
    });
  } catch (err) {
    return res.send({
      code: "400",
      status: "BAD_REQUEST",
      message: err.message,
    });
  }
});

//delete one item with id
router.delete("/:id", IsAuth, async function (req, res, next) {
  try {
    const productId = req.params.id;
    const cart = await model.carts.destroy({ where: { productId: productId } });
    return res.send({
      code: "200",
      status: "SUCCESS",
      data: {
        cart,
      },
    });
  } catch (err) {
    return res.send({
      code: "400",
      status: "BAD_REQUEST",
      message: err.message,
    });
  }
});

//delete all item in cart with customer id
router.delete("/:id", IsAuth, async function (req, res, next) {
  try {
    const customerId = req.params.id;
    const cart = await model.carts.destroy({
      where: { customerId: customerId },
    });
    return res.send({
      code: "200",
      status: "SUCCESS",
      data: {
        cart,
      },
    });
  } catch (err) {
    return res.send({
      code: "400",
      status: "BAD_REQUEST",
      message: err.message,
    });
  }
});
module.exports = router;
