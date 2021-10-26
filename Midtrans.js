require("dotenv").config(); // this is important!
const midtransClient = require("midtrans-client");
const snap = new midtransClient.Snap({
  isProduction: process.env.MIDTRANS_ENV,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

module.exports = snap;
