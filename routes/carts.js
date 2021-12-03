const express = require("express");
const router = express.Router();
const model = require("../models/index");
const { Op } = require("sequelize");
const snap = require("../Midtrans");
const IsAuth = require("../middleware/IsAuth");
const CalculateShippingCost = require("../utils/CalculateShippingCost");
const RajaOngkir = require("rajaongkir-nodejs").Starter(
  "40714cc6e20d56f0f752a24a3ab06a35"
);

//add to cart with customerUID
router.post("/", async function (req, res) {
  try {
    const { customerUID, productId } = req.body;

    if (!productId || !customerUID) {
      return res.status(401).json({ message: "missing require data" });
    }
    const Product = await model.products.findOne({ where: { id: productId } });
    const sellerUID = Product.sellerUID;

    //check apakah order dengan customerUID dan status 0 sudah ada
    let order = await model.orders.findOne({
      where: { customerUID: customerUID, status: 0 },
    });
    //jika tidak ada, maka akan dibuat
    if (!order) {
      order = await model.orders.create({
        customerUID: customerUID,
        totalQuantity: 0,
        totalPrice: 0,
      });
    }
    const orderId = order.id;

    //check apakah cart dengan orderId dan sellerUID sudah ada
    let cart = await model.carts.findOne({
      where: { orderId: orderId, sellerUID: sellerUID },
    });
    //jika tidak ada, maka akan dibuat
    if (!cart) {
      cart = await model.carts.create({
        orderId: orderId,
        sellerUID: sellerUID,
      });
    }
    const cartId = cart.id;

    //mengurangi stock dari produk (-1)
    const { name, slug, price, thumbnail } = Product;

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
        thumbnail,
        quantity: 1,
      });
    } else {
      cartItem.increment("quantity", {
        by: 1,
      });
    }

    order.increment({
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
    const orders = await model.orders.findOne({
      where: { customerUID: customerUID, status: 0 },
      include: [
        {
          model: model.carts,
          as: "carts",
          include: [
            {
              model: model.cartItems,
              as: "cartItems",
            },
            {
              model: model.sellers,
              as: "seller",
              include: [
                {
                  model: model.addresses,
                  as: "address",
                },
              ],
            },
          ],
        },
      ],
    });
    return res.json({
      data: orders,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

//return all cartItem by customerId
router.get("/checkout/:id", async function (req, res) {
  try {
    const customerUID = req.params.id;
    const orders = await model.orders.findAll({
      where: {
        customerUID: customerUID,
        status: {
          [Op.gt]: 0,
        },
      },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: model.carts,
          as: "carts",
          include: [
            {
              model: model.cartItems,
              as: "cartItems",
            },
            {
              model: model.sellers,
              as: "seller",
            },
          ],
        },
      ],
    });
    return res.json({
      data: orders,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

//checkout
router.put("/checkout", async function (req, res) {
  try {
    const { alamatId, kurirIds, customerUID } = req.body;
    const orders = await model.orders.findOne({
      where: { customerUID: customerUID, status: 0 },
      include: [
        {
          model: model.carts,
          as: "carts",
          include: [
            {
              model: model.cartItems,
              as: "cartItems",
            },
            {
              model: model.sellers,
              as: "seller",
            },
          ],
        },
      ],
    });

    const address = await model.addresses.findOne({
      where: { id: alamatId },
    });
    const arrName = address.nama.split(/\s/gi);
    const addressRecap = address.recap.split(/,/g);
    const formatedAddress = {
      first_name: arrName[0],
      last_name: arrName[arrName.length - 1] ?? "-",
      email: address.email,
      phone: address.notelp,
      address: address.keterangan,
      city: addressRecap[1],
    };

    let totalPrice = 0;
    let totalQuantity = 0;
    let item_details = [];
    let promises = [];

    orders.carts.forEach(async (cart) => {
      const kurirId = kurirIds[cart.id].id;
      const sellerId = cart.seller.uid;
      promises.push(
        model.addresses
          .findOne({
            where: {
              sellerUID: sellerId,
            },
          })
          .then((sellerAddress) => {
            return CalculateShippingCost(
              sellerAddress.city,
              address.city,
              kurirId
            );
          })
          .then((result) => {
            const shippingCost =
              result.rajaongkir.results[0].costs[0].cost[0].value;
            console.log(shippingCost);
            item_details.push({
              id: `Kurir-${kurirId}`,
              price: shippingCost,
              quantity: 1,
              name: kurirId,
            });

            totalPrice += shippingCost;

            cart.cartItems.forEach(async (item) => {
              totalQuantity += item.quantity;
              totalPrice += item.price * item.quantity;
              item_details.push({
                id: `Product-${item.id}`,
                price: item.price,
                quantity: item.quantity,
                name: item.name,
                merchant_name: cart.seller.name,
              });
            });

            return cart.update({
              kurirId: kurirId,
              ongkir: shippingCost,
            });
          })
      );
    });

    await Promise.all(promises);

    await model.orders.update(
      {
        alamatId: address.id,
        totalPrice,
        totalQuantity,
        status: 1,
      },
      { where: { customerUID: customerUID, status: 0 } }
    );

    const parameter = {
      transaction_details: {
        order_id: `${orders.id}-${customerUID}`,
        gross_amount: totalPrice,
      },
      item_details: item_details,
      customer_details: {
        first_name: arrName[0],
        last_name: arrName.length > 1 ? arrName[arrName.length - 1] : "",
        shipping_address: formatedAddress,
      },
      enabled_payments: ["bri_va", "bca_va", "bni_va"],
    };
    const snapLink = await snap.createTransaction(parameter);
    return res.json({
      data: {
        redirectUrl: snapLink.redirect_url,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

//hapus 1 item dari cart berdasarkan cartId
router.delete("/:id", async function (req, res) {
  try {
    const id = req.params.id;
    const cartItems = await model.cartItems.destroy({
      where: { id: id },
    });
    return res.json({
      data: {
        cartItems,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

module.exports = router;
