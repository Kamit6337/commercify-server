import stripe from "stripe";
import { environment } from "../../utils/environment.js";
import Req from "../../utils/Req.js";
import decrypt from "../../utils/encryption/decrypt.js";

const Stripe = stripe(environment.STRIPE_SECRET_KEY);
const webhookSecretKey = environment.STRIPE_WEBHOOK_SECRET_KEY;

const webhookCheckout = (request, response) => {
  const sig = request.headers["stripe-signature"];

  const { wb } = Req(request);

  if (!wb) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  let event;
  try {
    event = Stripe.webhooks.constructEvent(request.body, sig, webhookSecretKey);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  if (event.type === "checkout.session.completed") {
    const { address, products } = decrypt(wb);

    console.log("address", address);
    console.log("products", products);

    const checkoutSessionCompleted = event.data.object;

    console.log("checkoutSessionCompleted", checkoutSessionCompleted);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
};

export default webhookCheckout;
