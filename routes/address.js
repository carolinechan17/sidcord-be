const express = require("express");
const router = express.Router();
const model = require("../models/index");
const { Op } = require("sequelize");
const RajaOngkir = require("rajaongkir-nodejs").Starter(
  "40714cc6e20d56f0f752a24a3ab06a35"
);

router.post("/", async (req, res) => {
  const {
    customerUID = null,
    sellerUID = null,
    provinsi,
    city,
    keterangan,
    email,
    nama,
    notelp,
  } = req.body;
  if (!provinsi || !city || !keterangan)
    return res.status(401).json({ message: "missing require data" });

  const cityData = await RajaOngkir.getCity(city).then(
    (result) => result.rajaongkir.results
  );

  const ProvinsiData = await RajaOngkir.getProvince(provinsi).then(
    (result) => result.rajaongkir.results
  );

  const recap = `${keterangan}, ${cityData.city_name}, ${ProvinsiData.province}`;

  const addresses = await model.addresses
    .create({
      customerUID,
      sellerUID,
      provinsi,
      city,
      keterangan,
      email,
      nama,
      notelp,
      recap,
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

router.get("/", async (req, res) => {
  const { customerUID = null, sellerUID = null } = req.query;
  console.log(customerUID);
  let params = [];
  if (customerUID) params.push({ customerUID: customerUID });
  if (sellerUID) params.push({ sellerUID: sellerUID });
  const address = await model.addresses
    .findAll({
      where: {
        [Op.or]: params,
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
