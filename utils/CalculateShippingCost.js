const RajaOngkir = require("rajaongkir-nodejs").Starter(
  "40714cc6e20d56f0f752a24a3ab06a35"
);

async function CalculateShippingCost(asal, tujuan, kurir) {
  const params = {
    origin: asal,
    destination: tujuan,
    weight: 1000,
  };

  let query = RajaOngkir;

  switch (kurir) {
    case "POS":
      query = query.getPOSCost(params);
      break;
    case "TIKI":
      query = query.getTIKICost(params);
      break;
    default:
      //JNE
      query = query.getJNECost(params);
      break;
  }

  return query;
}

module.exports = CalculateShippingCost;
