import catchAsyncError from "../../lib/catchAsyncError.js";
import stripe from "stripe";
import { environment } from "../../utils/environment.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";
import Product from "../../models/ProductModel.js";
import changePriceDiscountByExchangeRate from "../../utils/javaScript/changePriceDiscountByExchangeRate.js";
import encrypt from "../../utils/encryption/encrypt.js";
import Address from "../../models/AddressModel.js";
import dateInMilli from "../../utils/javaScript/dateInMilli.js";
import Buy from "../../models/BuyModel.js";
const PRODUCTION = "production";

const Stripe = stripe(environment.STRIPE_SECRET_KEY);

const makePaymentSession = catchAsyncError(async (req, res, next) => {
  const user = req.user;
  const userId = req.userId;

  const { products, address: addressId, code, exchangeRate } = req.body;

  if (!products || !addressId || !code || !exchangeRate) {
    return next(new HandleGlobalError("Not provide all fields", 404));
  }

  const findAddress = await Address.findOne({ _id: addressId }).lean();

  const productIds = products.map((obj) => obj.id);

  const findProducts = await Product.find({
    _id: { $in: productIds },
  }).lean();

  let lineItems = findProducts.map((product) => {
    const { _id, title, description, price, discountPercentage, thumbnail } =
      product;

    const findQuantity = products.find((obj) => obj.id === String(_id));
    const { discountedPrice } = changePriceDiscountByExchangeRate(
      price,
      discountPercentage,
      exchangeRate
    );
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

  const { name, mobile, address, district, state, country, dial_code } =
    findAddress;

  const customer = await Stripe.customers.create({
    name: user.name,
    email: user.email,
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
    success_url: `${environment.CLIENT_URL}/payment/success`,
    cancel_url: environment.CLIENT_URL + "/payment/cancel",
    customer: customer.id,
    client_reference_id: req.userId,
    mode: "payment",
    line_items: lineItems,
  });

  const addNewAddress = await Address.create({
    name,
    mobile: Number(mobile),
    address,
    district,
    country,
    dial_code,
    state,
  });

  const buyProducts = await Promise.all(
    findProducts.map(async (product) => {
      const { _id, price, deliveredBy, discountPercentage } = product;

      const findQuantity = products.find((obj) => obj.id === String(_id));

      const discountedPriceWithoutExchangeRate =
        (price * (100 - Math.trunc(discountPercentage))) / 100;

      // Use findOneAndUpdate to create the Buy and populate the product and address fields in one go
      const newBuyProduct = await Buy.findOneAndUpdate(
        {
          user: userId,
          product: _id,
          price: Number(discountedPriceWithoutExchangeRate),
          quantity: Number(findQuantity.quantity),
          address: addNewAddress._id,
          exchangeRate: Number(exchangeRate),
          deliveredDate: dateInMilli(Number(deliveredBy)),
        },
        {},
        { new: true, upsert: true, populate: ["product", "address"] } // Populate both product and address fields
      );

      return newBuyProduct;
    })
  );

  const buysId = buyProducts.map((obj) => String(obj._id));

  const obj = {
    buysId,
  };

  const encryptBuysId = encrypt(obj);

  const cookieOptions = {
    maxAge: 1 * 24 * 60 * 60 * 1000, //1 day
    httpOnly: true,
  };

  if (environment.NODE_ENV === PRODUCTION) {
    cookieOptions.secure = true;
    cookieOptions.sameSite = "None";
  }

  res.cookie("ords", encryptBuysId, cookieOptions);

  res.status(200).json({
    message: "Payment session Created",
    session,
  });
});

export default makePaymentSession;
