import stripe from "stripe";
import { environment } from "../../utils/environment.js";
import catchAsyncError from "../../lib/catchAsyncError.js";
import Buy from "../../models/BuyModel.js";
import Address from "../../models/AddressModel.js";
import connectToDB from "../../lib/connectToDB.js";

const Stripe = stripe(environment.STRIPE_SECRET_KEY);
const webhookSecretKey = environment.STRIPE_WEBHOOK_SECRET_KEY;

const webhookCheckout = catchAsyncError(async (request, response) => {
  const sig = request.headers["stripe-signature"];

  let event;
  try {
    event = Stripe.webhooks.constructEvent(request.body, sig, webhookSecretKey);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  if (event.type !== "checkout.session.completed") {
    response.send("Error occur");
    return;
  }

  const session = event.data.object;
  const { client_reference_id, metadata, id: stripeId } = session;

  const {
    products,
    address: addressId,
    sessionId,
  } = JSON.parse(metadata.willBuyProducts);

  await connectToDB();

  const findAddress = await Address.findOne({ _id: addressId }).lean();

  const { name, mobile, address, district, state, country, dial_code } =
    findAddress;

  const addNewAddress = await Address.create({
    name,
    mobile: Number(mobile),
    address,
    district,
    country,
    dial_code,
    state,
  });

  await Promise.all(
    products.map(async (product) => {
      const newProduct = { ...product };

      await Buy.create({
        ...newProduct,
        sessionId,
        stripeId,
        user: client_reference_id,
        address: addNewAddress._id,
      });
      return null;
    })
  );

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});

export default webhookCheckout;
