import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is required");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

export const getStripePublishableKey = () => {
  if (!process.env.STRIPE_PUBLISHABLE_KEY) {
    throw new Error("STRIPE_PUBLISHABLE_KEY is required");
  }
  return process.env.STRIPE_PUBLISHABLE_KEY;
};
