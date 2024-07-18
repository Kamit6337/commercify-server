import stripe from "stripe";
import { environment } from "../../utils/environment.js";
import catchAsyncError from "../../lib/catchAsyncError.js";
import Buy from "../../models/BuyModel.js";
import Address from "../../models/AddressModel.js";
import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";
import User from "../../models/UserModel.js";

const Stripe = stripe(environment.STRIPE_SECRET_KEY);
const webhookSecretKey = environment.STRIPE_WEBHOOK_SECRET_KEY;

// Set up nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: environment.MY_GMAIL_ID,
    pass: environment.MY_GMAIL_PASSWORD,
  },
});

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
    response.send();
    return;
  }

  const session = event.data.object;
  const { client_reference_id, metadata, id: stripeId } = session;

  const {
    products,
    address: addressId,
    sessionId,
  } = JSON.parse(metadata.willBuyProducts);

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

  const findUser = await User.findOne({ _id: client_reference_id }).lean();

  // Render HTML template with dynamic OTP
  const htmlTemplate = await ejs.renderFile(
    path.join("views", "userBuyProducts.ejs"),
    {
      products,
    }
  );

  // Set up email options
  const mailOptions = {
    from: `Commercify ${environment.MY_GMAIL_ID}`,
    to: findUser.email,
    subject: "Commercify: Your order summary",
    html: htmlTemplate,
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ error: "Error sending email" });
    }
    response.json({ message: "Email sent successfully", info });
  });

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});

export default webhookCheckout;
