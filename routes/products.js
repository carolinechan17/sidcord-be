const express = require("express");
const router = express.Router();
const model = require("../models/index");
const { Op } = require("sequelize");
const IsSeller = require("../middleware/IsSeller");
const IsAuth = require("../middleware/IsAuth");
//create new product
router.post("/", async function (req, res, next) {
  try {
    const { name, slug, price, stock, sellerUID, thumbnail, description } =
      req.body;
    const product = await model.products.create({
      name,
      slug,
      price,
      stock,
      sellerUID,
      thumbnail,
      description,
    });
    return res.send({
      code: 200,
      status: "SUCCESS",
      data: {
        product,
      },
    });
  } catch (err) {
    return res.status(400).send({
      code: 400,
      status: "BAD_REQUEST",
      message: err.message,
    });
  }
});

//return products that belongs to seller with id
router.get("/", async function (req, res, next) {
  try {
    const product = await model.products.findAll();
    return res.send({
      code: 200,
      status: "SUCCESS",
      data: {
        product,
      },
    });
  } catch (err) {
    return res.send({
      code: 400,
      status: "BAD_REQUEST",
      message: err.message,
    });
  }
});

//return products that belongs to seller with id
router.get("/:query", async function (req, res, next) {
  try {
    const query = req.params.query;
    const product = await model.products.findOne({
      where: { slug: query },
    });
    return res.send({
      code: 200,
      status: "SUCCESS",
      data: {
        product,
      },
    });
  } catch (err) {
    return res.send({
      code: 400,
      status: "BAD_REQUEST",
      message: err.message,
    });
  }
});

//update product with id
router.put("/:id", async function (req, res, next) {
  try {
    const id = req.params.id;
    const { name, slug, price, stock, sellerId } = req.body;
    const product = await model.products.update(
      { name, slug, price, stock, sellerId },
      { where: { id: id } }
    );
    return res.send({
      code: 200,
      status: "SUCCESS",
      data: {
        product,
      },
    });
  } catch (err) {
    return res.send({
      code: 400,
      status: "BAD_REQUEST",
      message: err.message,
    });
  }
});

//delete product with id
router.delete("/:id", async function (req, res, next) {
  try {
    const id = req.params.id;
    const product = await model.products.destroy({ where: { id: id } });
    return res.send({
      code: 200,
      status: "SUCCESS",
      data: {
        product,
      },
    });
  } catch (err) {
    return res.send({
      code: 400,
      status: "BAD_REQUEST",
      message: err.message,
    });
  }
});

module.exports = router;
