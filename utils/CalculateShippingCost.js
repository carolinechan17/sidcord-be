function CalculateShippingCost(basePrice, address) {
  let totalASCIIProvinsi = 0;
  let totalASCIIKota = 0;
  const provinsiTujuan = address.provinsi;
  const kotaTujuan = address.city;
  for (let i = 0; i < provinsiTujuan.length; i++) {
    totalASCIIProvinsi += provinsiTujuan.charCodeAt(i);
  }
  for (let i = 0; i < kotaTujuan.length; i++) {
    totalASCIIKota += kotaTujuan.charCodeAt(i);
  }
  return (basePrice * Math.abs(totalASCIIKota - totalASCIIProvinsi)) / 100;
}

module.exports = CalculateShippingCost;
