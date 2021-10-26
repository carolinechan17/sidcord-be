const express = require("express");
const router = express.Router();
const snap = require("../Midtrans");
const model = require("../models/index");

async function HandlePaymentComplate(PaymentData) {
  const arrOrderId = PaymentData.order_id.split("-");
  return await model.carts
    .update({ status: 2 }, { where: { id: arrOrderId[0] } })
    .then(() => true)
    .catch((err) => {
      console.log(err);
      return false;
    });
}

router.post("/webhook", async (req, res) => {
  const PaymentData = await snap.transaction
    .notification(req.body)
    .catch((err) => {
      console.log(err);
      return res.status(404).json(err.ApiResponse);
    });

  let IsSuccessUpdate = false;

  switch (PaymentData.transaction_status) {
    case "settlement":
      IsSuccessUpdate = HandlePaymentComplate(PaymentData);
      break;

    default:
      IsSuccessUpdate = true;
      break;
  }

  if (IsSuccessUpdate) {
    return res.json(PaymentData);
  }

  return res.status(500).json({ message: "error" });
});
module.exports = router;
