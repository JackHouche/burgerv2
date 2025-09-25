import Stripe from "stripe";

// Instance Stripe lazy - ne sera créée qu'au runtime
let stripeInstance: Stripe | null = null;

export const getStripe = (): Stripe => {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is required");
    }

    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-02-24.acacia",
      // Use fetch-based HTTP client for Edge Runtime compatibility
      httpClient: Stripe.createFetchHttpClient(),
    });
  }

  return stripeInstance;
};

export const getStripePublishableKey = () => {
  if (!process.env.STRIPE_PUBLISHABLE_KEY) {
    throw new Error("STRIPE_PUBLISHABLE_KEY is required");
  }
  return process.env.STRIPE_PUBLISHABLE_KEY;
};
