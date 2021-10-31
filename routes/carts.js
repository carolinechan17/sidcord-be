const express = require("express");
const router = express.Router();
const model = require("../models/index");
const { Op } = require("sequelize");
const snap = require("../Midtrans");
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
    await Product.increment("stock", {
      by: -1,
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
    console.log(err);
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
      order: [["createdAt", "DESC"]],
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
    const { namaPenerima, email, noTelp, alamat, namaKurir, id, customerUID } =
      req.body;
    const cartItems = await model.cartItems.findAll({
      where: { cartId: id },
    });
    let totalPrice = 0;
    let item_details = [];

    cartItems.forEach((item) => {
      totalPrice += item.price * item.quantity;
      item_details.push({
        id: item.slug,
        price: item.price,
        quantity: item.quantity,
        name: item.name,
        brand: "",
        category: "Compe",
        merchant_name: "",
      });
    });

    const cart = await model.carts.update(
      { namaPenerima, email, noTelp, alamat, totalPrice, status: 1, namaKurir },
      { where: { id: id } }
    );

    const arrName = namaPenerima.split(/\s/gi);

    const parameter = {
      transaction_details: {
        order_id: `${id}-${customerUID}`,
        gross_amount: totalPrice,
      },
      item_details: item_details,
      customer_details: {
        first_name: arrName[0],
        last_name: arrName.length > 1 ? arrName[arrName.length - 1] : "",
        email: email,
        phone: noTelp,
      },
      enabled_payments: ["bri_va", "bca_va", "bni_va", "gopay"],
    };
    console.log(parameter);
    const snapLink = await snap.createTransaction(parameter);
    return res.send({
      data: {
        cart,
        redirectUrl: snapLink.redirect_url,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

module.exports = router;
