const express = require("express");
const IsAuth = require("../middleware/IsAuth");
const IsSeller = require("../middleware/IsSeller");
const router = express.Router();
const model = require("../models/index");
const admin = require("../admin");

//create new seller
router.post("/", IsAuth, async function (req, res, next) {
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
      res.send({
        code: 200,
        status: "STATUS",
        data: {
          seller,
        },
      });
    })
    .catch((err) => {
      return res.send({
        code: 400,
        status: "BAD_REQUEST",
        message: err.message,
      });
    });
});

router.get("/get/products", IsSeller, async function (req, res, next) {
  try {
    const { uid } = req.body;
    const product = await model.products.findAll({
      where: { sellerUID: uid },
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

//return seller data with id
router.get("/:id", async function (req, res, next) {
  try {
    const id = req.params.id;
    const seller = await model.sellers.findOne({ where: { id: id } });
    return res.send({
      code: 200,
      status: "SUCCESS",
      data: {
        seller,
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

//update profile seller
router.put("/:id", async function (req, res, next) {
  try {
    const id = req.params.id;
    const { name, email, password, phone } = req.body;
    const seller = await model.sellers.update(
      { name, email, password, phone },
      { where: { id: id } }
    );
    return res.send({
      code: 200,
      status: "SUCCESS",
      data: {
        seller,
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

//delete account seller
router.delete("/:id", async function (req, res, next) {
  try {
    const id = req.params.id;
    const seller = await model.sellers.destroy({ where: { id: id } });
    return res.send({
      code: 200,
      status: "SUCCESS",
      data: {
        seller,
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
