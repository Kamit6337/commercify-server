import catchAsyncError from "../../lib/catchAsyncError.js";
import stripe from "stripe";
import { environment } from "../../utils/environment.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";
import Product from "../../models/ProductModel.js";
import changePriceDiscountByExchangeRate from "../../utils/javaScript/changePriceDiscountByExchangeRate.js";
import Address from "../../models/AddressModel.js";
import dateInMilli from "../../utils/javaScript/dateInMilli.js";
import generateUniqueId from "../../utils/javaScript/generateUniqueId.js";

const Stripe = stripe(environment.STRIPE_SECRET_KEY);

const makePaymentSession = catchAsyncError(async (req, res, next) => {
  const user = req.user;
  const userId = req.userId;
  const CHECKOUT_SESSION_ID = generateUniqueId();
  const { products, address: addressId, code, exchangeRate, symbol } = req.body;

  if (!products || !addressId || !code || !exchangeRate || !symbol) {
    return next(new HandleGlobalError("Not provide all fields", 404));
  }

  const findAddress = await Address.findOne({ _id: addressId }).lean();

  const productIds = products.map((obj) => obj.id);

  const findProducts = await Product.find({
    _id: { $in: productIds },
  }).lean();

  const willBuyProducts = {
    products: [],
    address: addressId,
    sessionId: CHECKOUT_SESSION_ID,
  };

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

    // Use findOneAndUpdate to create the Buy and populate the product and address fields in one go
    const obj = {
      product: _id,
      price: Number(discountedPriceWithoutExchangeRate),
      quantity: Number(findQuantity.quantity),
      exchangeRate: Number(exchangeRate),
      deliveredDate: dateInMilli(Number(deliveredBy)),
    };

    willBuyProducts.products.push(obj);

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

  const { address, district, state } = findAddress;

  const customer = await Stripe.customers.create({
    name: user.name,
    email: user.email,
    phone: user.mobile,
    address: {
      line1: address,
      city: district,
      state: state,
      country: "US",
    },
  });

  // Create a PaymentIntent with the order amount and currency
  const session = await Stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    success_url: `${environment.CLIENT_URL}/payment/success?sessionId=${CHECKOUT_SESSION_ID}`,
    cancel_url: environment.CLIENT_URL + "/payment/cancel",
    customer: customer.id,
    client_reference_id: userId,
    mode: "payment",
    invoice_creation: {
      enabled: true,
    },
    line_items: lineItems,
    metadata: {
      willBuyProducts: JSON.stringify(willBuyProducts),
    },
  });

  res.status(200).json({
    message: "Payment session Created",
    session,
  });
});

export default makePaymentSession;
