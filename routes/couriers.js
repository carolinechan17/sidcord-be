const express = require("express");
const router = express.Router();
const model = require("../models/index");
const RajaOngkir = require("rajaongkir-nodejs").Starter(
  "40714cc6e20d56f0f752a24a3ab06a35"
);
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

//check ongkir
router.post("/ongkir", function (req, res) {
  const { kurir, asal, tujuan } = req.body;
  const params = {
    origin: asal,
    destination: tujuan,
    weight: 1000,
  };

  let query = RajaOngkir;

  switch (kurir) {
    case "POS":
      query = query.getPOSCost(params);
    case "TIKI":
      query = query.getTIKICost(params);
    default:
      //JNE
      query = query.getJNECost(params);
      break;
  }

  return query
    .then((result) => {
      return res.json(result);
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).json(err);
    });
});

router.get("/provinsi/:provinsiId", async (req, res) => {
  const { provinsiId = null } = req.params;
  let query = RajaOngkir;

  if (provinsiId) query = query.getProvince(provinsiId);
  else query = query.getProvinces();

  return query
    .then((result) => {
      return res.json(result);
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).json(err);
    });
});

router.get("/kota/:id", async (req, res) => {
  const idKota = req.params.id;
  if (idKota) return res.status(401).json({ message: "missing id kota" });

  return RajaOngkir.getCity(idKota)
    .then((result) => {
      return res.json(result);
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).json(err);
    });
});

module.exports = router;
