const express = require("express");
const router = express.Router();
const snap = require("../Midtrans");
const model = require("../models/index");

async function HandlePaymentChangeStatus(PaymentData, status = 2) {
  const arrOrderId = PaymentData.order_id.split("-");
  return await model.orders
    .update({ status: status }, { where: { id: arrOrderId[0] } })
    .then(() => {
      return model.carts.update(
        { status },
        { where: { orderId: arrOrderId[0] } }
      );
    })
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
      IsSuccessUpdate = HandlePaymentChangeStatus(PaymentData);
      await model.payments.update(
        {
          status: PaymentData.transaction_status,
          data: JSON.stringify(PaymentData),
        },
        {
          where: {
            name: PaymentData.order_id,
          },
        }
      );
      break;
    case "expire":
      IsSuccessUpdate = HandlePaymentChangeStatus(PaymentData, 6);
      await model.payments.update(
        {
          status: PaymentData.transaction_status,
          data: JSON.stringify(PaymentData),
        },
        {
          where: {
            name: PaymentData.order_id,
          },
        }
      );
      break;
    default:
      await model.payments.create({
        name: PaymentData.order_id,
        amount: parseInt(PaymentData.gross_amount),
        status: PaymentData.transaction_status,
        data: JSON.stringify(PaymentData),
      });
      IsSuccessUpdate = true;
      break;
  }

  if (IsSuccessUpdate) {
    return res.json(PaymentData);
  }

  return res.status(500).json({ message: "error" });
});

router.get("/:id", async (req, res) => {
  const orderId = req.params.id;
  return model.payments
    .findOne({
      where: {
        name: orderId,
      },
    })
    .then((result) => {
      return res.json(result);
    });
});
module.exports = router;
