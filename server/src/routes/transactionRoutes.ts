import express from "express";
import {
  createStripePaymentIntent,
  listTransactions,
} from "../controllers/transactionController";

const router = express.Router();

router.get("/", listTransactions);
router.post("/stripe/payment-intent", createStripePaymentIntent);

export default router;
