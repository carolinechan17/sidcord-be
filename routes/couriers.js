const express = require("express");
const router = express.Router();
const model = require("../models/index");
const RajaOngkir = require("rajaongkir-nodejs").Starter(
  "40714cc6e20d56f0f752a24a3ab06a35"
);
const request = require("request");
const Promise = require("promise");
const CalculateShippingCost = require("../utils/CalculateShippingCost");

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
  return res.json({
    data: [
      {
        id: "JNE",
        nama: "JNE",
      },
      {
        id: "TIKI",
        nama: "TIKI",
      },
      {
        id: "POS",
        nama: "POS",
      },
    ],
  });
});

//check ongkir
router.post("/ongkir", async (req, res) => {
  const { kurir, asal, tujuan } = req.body;

  return CalculateShippingCost(asal, tujuan, kurir)
    .then((result) => {
      return res.json(result.rajaongkir.results[0].costs[0].cost);
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).json(err);
    });
});

router.get("/provinsi/:provinsiId", async (req, res) => {
  const { provinsiId = null } = req.params;

  if (!provinsiId) return res.sendStatus(401);

  return RajaOngkir.getProvince(provinsiId)
    .then((result) => {
      return res.json(result);
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).json(err);
    });
});

router.get("/provinsi/", async (req, res) => {
  return RajaOngkir.getProvinces()
    .then((result) => {
      return res.json(result.rajaongkir.results);
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).json(err);
    });
});

router.get("/kota/:id", async (req, res) => {
  const idKota = req.params.id;
  if (!idKota) return res.status(401).json({ message: "missing id kota" });

  const getCityByProvince = function (id) {
    const uri = "https://api.rajaongkir.com/starter/city?province=" + id;
    const apiKey = "40714cc6e20d56f0f752a24a3ab06a35";
    return new Promise(function (resolve, reject) {
      request(
        {
          uri: uri,
          method: "GET",
          headers: {
            key: apiKey,
          },
        },
        function (error, response, body) {
          console.log(body);
          var result = JSON.parse(body);
          if (result.rajaongkir.status.code !== 200) reject(result);
          resolve(result);
        }
      );
    });
  };

  return getCityByProvince(idKota)
    .then((result) => {
      return res.json(result.rajaongkir.results);
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).json(err);
    });
});

module.exports = router;
