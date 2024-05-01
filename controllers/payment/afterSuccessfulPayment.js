import Buy from "../../models/BuyModel.js";
import Address from "../../models/AddressModel.js";
import catchAsyncError from "../../lib/catchAsyncError.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";
import Product from "../../models/ProductModel.js";
import mongoose from "mongoose";

const dateInMilli = (day) => {
  const now = Date.now();
  const calculateMilli = day * 24 * 60 * 60 * 1000;
  return now + calculateMilli;
};

const afterSuccessfulPayment = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const { products, address: addressId, exchangeRate } = req.query;

  if (!products || !addressId || !exchangeRate) {
    return next(new HandleGlobalError("All fields are not provided", 404));
  }

  const findAddress = await Address.findOne({ _id: addressId }).lean();

  if (!findAddress) {
    // Handle case when address with the given ID is not found
    return next(new HandleGlobalError("Address not found", 404));
  }

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
    user: userId,
  });

  const productIds = products.map((obj) => obj.id);

  const findProducts = await Product.find({
    _id: { $in: productIds },
  }).lean();

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

  buyProducts.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  res.status(200).json({
    message: "Payment Successful",
    data: buyProducts,
  });
});

export default afterSuccessfulPayment;
