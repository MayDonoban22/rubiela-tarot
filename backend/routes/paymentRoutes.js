const express = require("express");

const router = express.Router();

const { createPaymentSession } = require("../controllers/paymentController");

const auth = require("../middlewares/auth");

router.post(

    "/create-session/:turnoId",

    auth,

    createPaymentSession

);

module.exports = router;