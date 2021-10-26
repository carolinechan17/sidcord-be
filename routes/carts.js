const express = require("express");
const router = express.Router();
const model = require("../models/index");
const { Op } = require("sequelize");
const IsAuth = require("../middleware/IsAuth");
//add to cart with customer id
router.post("/", async function (req, res) {
  try {
    const { customerUID, productId } = req.body;

    if (!productId || !customerUID) {
      return res.status(401).json({ message: "missing require data" });
    }

    //check apakah cart dengan uid dan status 0 sudah ada
    let cart = await model.carts.findOne({
      where: { customerUID: customerUID, status: 0 },
    });
    //jika tidak, maka akan dibuat
    if (!cart) {
      cart = await model.carts.create({
        customerUID: customerUID,
        totalQuantity: 0,
        totalPrice: 0,
      });
    }
    const cartId = cart.id;
    //mengurangi stock dari produk (-1)
    const Product = await model.products.findOne({ where: { id: productId } });
    const { name, slug, price, sellerUID, thumbnail, description } = Product;
    await Product.increment("stock", {
      by: -1,
    });
    let cartItem = await model.cartItems.findOne({
      where: { cartId: cartId, slug: slug },
    });
    if (!cartItem) {
      cartItem = await model.cartItems.create({
        cartId,
        name,
        slug,
        price,
        sellerUID,
        description,
        thumbnail,
        quantity: 1,
      });
    } else {
      cartItem.increment("quantity", {
        by: 1,
      });
    }
    await cart.increment({
      totalQuantity: 1,
      totalPrice: Product.price,
    });

    res.json({
      data: {
        cartItem,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

//return all cartItem by cartId
router.get("/:id", async function (req, res) {
  try {
    const customerUID = req.params.id;
    const carts = await model.carts.findOne({
      where: { customerUID: customerUID, status: 0 },
      include: "cartItems",
    });
    return res.json({
      data: carts,
    });
  } catch (err) {
    res.status(400).json(err);
  }
});
//return all cartItem by cartId
router.get("/checkout/:id", async function (req, res) {
  try {
    const customerUID = req.params.id;
    const carts = await model.carts.findAll({
      where: {
        customerUID: customerUID,
        status: {
          [Op.gte]: 0,
        },
      },
      include: "cartItems",
    });
    return res.json({
      data: carts,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

//checkout by cartId
//pada checkout, customer akan mengisi data namaPenerima, email, noTelp, alamat, namaKurir
router.put("/checkout", async function (req, res) {
  try {
    const { namaPenerima, email, noTelp, alamat, namaKurir, id } = req.body;
    const totalPrice = await model.cartItems.sum("price", {
      where: { cartId: id },
    });
    const cart = await model.carts.update(
      { namaPenerima, email, noTelp, alamat, totalPrice, status: 1, namaKurir },
      { where: { id: id } }
    );
    return res.send({
      data: {
        cart,
      },
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
