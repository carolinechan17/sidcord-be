const express = require("express");
const router = express.Router();
const model = require("../models/index");

router.post("/", async (req, res) => {
  const { customerUID, provinsi, city, keterangan, email, nama, notelp } =
    req.body;
  if (!customerUID || !provinsi || !city || !keterangan)
    return res.status(401).json({ message: "missing require data" });

  const addresses = await model.addresses
    .create({
      customerUID,
      provinsi,
      city,
      keterangan,
      email,
      nama,
      notelp,
    })
    .catch((err) => {
      console.log(err);
      return err;
    });

  if (addresses.message)
    return res.status(400).json({
      status: "BAD_REQUEST",
      message: addresses.message,
    });

  return res.send({
    code: 200,
    status: "STATUS",
    data: {
      addresses,
    },
  });
});

router.get("/", async (req, res) => {
  const { customerUID } = req.query;
  const address = await model.addresses
    .findAll({
      where: {
        customerUID: customerUID,
      },
    })
    .catch((err) => {
      console.log(err);
      return null;
    });
  return res.json({
    data: address,
  });
});

router.get("/:id", async (req, res) => {
  const addressId = req.params.id;
  const address = await model.addresses
    .findOne({
      where: {
        id: addressId,
      },
    })
    .catch((err) => {
      console.log(err);
      return null;
    });
  return res.json({
    data: address,
  });
});

module.exports = router;
