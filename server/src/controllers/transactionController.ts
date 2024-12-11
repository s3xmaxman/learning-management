import Stripe from "stripe";
import dotenv from "dotenv";
import { Request, Response } from "express";
import Transaction from "../models/transactionModel";

dotenv.config();

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not defined");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createStripePaymentIntent = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.query;

  try {
    const transaction = userId
      ? await Transaction.query("userId").eq(userId).exec()
      : await Transaction.scan().exec();

    res.json({
      message: "Transactions retrieved successfully",
      data: transaction,
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving transactions", error });
  }
};
