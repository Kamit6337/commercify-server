import catchAsyncError from "../../lib/catchAsyncError.js";
import stripe from "stripe";
import { environment } from "../../utils/environment.js";
import generateWebToken from "../../utils/auth/generateWebToken.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";
import Product from "../../models/ProductModel.js";

const Stripe = stripe(environment.STRIPE_SECRET_KEY);

const makePaymentSession = catchAsyncError(async (req, res, next) => {
  const user = req.user;

  const { products, address } = req.body;

  if (!products || !address) {
    return next(new HandleGlobalError("Not provide all fields", 404));
  }

  const productIds = products.map((obj) => obj.id);

  const findProducts = await Product.find({
    _id: { $in: productIds },
  }).lean();

  let productsForToken = [];

  let lineItems = findProducts.map((product) => {
    const { _id, title, description, price, discountPercentage, thumbnail } =
      product;

    const findQuantity = products.find((obj) => obj.id === String(_id));

    const roundDiscountPercent = Math.round(discountPercentage);
    const discountedPrice = Math.round(
      (price * (100 - roundDiscountPercent)) / 100
    );

    const obj = {
      id: _id,
      quantity: findQuantity.quantity,
      price: discountedPrice,
    };
    productsForToken = [...productsForToken, obj];

    return {
      price_data: {
        currency: "usd",
        unit_amount: discountedPrice * 100,
        product_data: {
          name: title,
          description: description,
          images: [thumbnail],
        },
      },
      quantity: findQuantity.quantity,
    };
  });

  const deliveryCharge = 4; // 4 dollars
  const delieveryObj = {
    price_data: {
      currency: "usd",
      unit_amount: deliveryCharge * 100,
      product_data: {
        name: "Delivery Charges",
        description: `Delivery charge for the above ${lineItems.length} products`,
      },
    },
    quantity: 1,
  };

  lineItems = [...lineItems, delieveryObj];

  const customer = await Stripe.customers.create({
    name: user.name,
    email: user.email,
    address: {
      line1: address.address,
      postal_code: address.pinCode,
      city: address.district,
      state: address.state,
      country: "US",
    },
  });

  const token = generateWebToken(
    { products: productsForToken, address },
    { expires: 10000000000 }
  );

  // Create a PaymentIntent with the order amount and currency
  const session = await Stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    success_url: `${environment.CLIENT_URL}/payment/success?token=${token}`,
    cancel_url: environment.CLIENT_URL + "/payment/cancel",
    customer: customer.id,
    client_reference_id: req.userId,
    mode: "payment",
    line_items: lineItems,
  });

  res.status(200).json({
    message: "Payment session Created",
    session,
  });
});

export default makePaymentSession;
