const model = require("../models/index");

async function CalculateShippingCost(basePrice, sellerId, address) {
  let totalASCIIProvinsi = 0;
  let totalASCIIKota = 0;
  const sellerAddres = await model.addresses.findOne({
    where: {
      sellerUID: sellerId,
    },
  });
  const provinsiTujuan = address.provinsi;
  const kotaTujuan = address.city;
  for (let i = 0; i < provinsiTujuan.length; i++) {
    totalASCIIProvinsi += provinsiTujuan.charCodeAt(i);
  }
  for (let i = 0; i < kotaTujuan.length; i++) {
    totalASCIIKota += kotaTujuan.charCodeAt(i);
  }
  const provinsiSeller = sellerAddres.provinsi;
  const kotaSeller = sellerAddres.city;
  for (let i = 0; i < provinsiSeller.length; i++) {
    totalASCIIProvinsi -= provinsiSeller.charCodeAt(i);
  }
  for (let i = 0; i < kotaSeller.length; i++) {
    totalASCIIKota -= kotaSeller.charCodeAt(i);
  }
  const tambahan = Math.abs(totalASCIIKota + totalASCIIProvinsi) / 100 || 1.2;

  return basePrice * tambahan;
}

module.exports = CalculateShippingCost;
