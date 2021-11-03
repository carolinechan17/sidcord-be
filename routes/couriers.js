const express = require("express");
const router = express.Router();
const model = require("../models/index");

router.post("/", async (req, res) => {
  const { nama, basePrice } = req.body;
  if (!nama || !basePrice)
    return res.status(401).json({ message: "missing require data" });

  const courier = await model.couriers
    .create({
      nama,
      basePrice,
    })
    .catch((err) => {
      console.log(err);
      return err;
    });

  if (courier.message)
    return res.status(400).json({
      status: "BAD_REQUEST",
      message: courier.message,
    });

  return res.send({
    code: 200,
    status: "STATUS",
    data: {
      courier,
    },
  });
});

router.get("/", async (req, res) => {
  const couriers = await model.couriers.findAll();
  return res.json({
    data: couriers,
  });
});

module.exports = router;
