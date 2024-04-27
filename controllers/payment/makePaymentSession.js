import catchAsyncError from "../../lib/catchAsyncError.js";
import stripe from "stripe";
import { environment } from "../../utils/environment.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";
import Product from "../../models/ProductModel.js";
import changePriceDiscountByExchangeRate from "../../utils/javaScript/changePriceDiscountByExchangeRate.js";
import encrypt from "../../utils/encryption/encrypt.js";

const Stripe = stripe(environment.STRIPE_SECRET_KEY);

const makePaymentSession = catchAsyncError(async (req, res, next) => {
  const user = req.user;

  const { products, address, code, exchangeRate } = req.body;

  if (!products || !address) {
    return next(new HandleGlobalError("Not provide all fields", 404));
  }

  const productIds = products.map((obj) => obj.id);

  const findProducts = await Product.find({
    _id: { $in: productIds },
  }).lean();

  let productsForToken = [];

  let lineItems = findProducts.map((product) => {
    const {
      _id,
      title,
      description,
      price,
      discountPercentage,
      thumbnail,
      deliveredBy,
    } = product;

    const findQuantity = products.find((obj) => obj.id === String(_id));

    const { discountedPrice } = changePriceDiscountByExchangeRate(
      price,
      discountPercentage,
      exchangeRate
    );

    const discountedPriceWithoutExchangeRate =
      (price * (100 - Math.trunc(discountPercentage))) / 100;

    const obj = {
      id: _id,
      quantity: findQuantity.quantity,
      price: discountedPriceWithoutExchangeRate,
      exchangeRate,
      deliveredBy,
    };

    productsForToken = [...productsForToken, obj];

    return {
      price_data: {
        currency: code,
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

  const deliveryCharge = Math.round(lineItems.length * exchangeRate * 0.48); // 4 dollars
  const delieveryObj = {
    price_data: {
      currency: code,
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

  const createToken = encrypt({ products: productsForToken, address });

  // Create a PaymentIntent with the order amount and currency
  const session = await Stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    success_url: `${environment.CLIENT_URL}/payment/success?token=${createToken}`,
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
