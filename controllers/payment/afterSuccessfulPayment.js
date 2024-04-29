import Buy from "../../models/BuyModel.js";
import Address from "../../models/AddressModel.js";
import catchAsyncError from "../../lib/catchAsyncError.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";
import decrypt from "../../utils/encryption/decrypt.js";

const dateInMilli = (day) => {
  const now = Date.now();
  const calculateMilli = day * 24 * 60 * 60 * 1000;
  return now + calculateMilli;
};

const afterSuccessfulPayment = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;
  const { token } = req.query;

  if (!token) {
    return next(new HandleGlobalError("Token is not provided", 404));
  }

  const { products, address: addressFromToken } = decrypt(token);

  const { name, mobile, address, district, state, country, dial_code } =
    addressFromToken;

  const addNewAddress = await Address.create({
    name,
    mobile: Number(mobile),
    address,
    state,
    district,
    country,
    dial_code,
  });

  const buyProducts = await Promise.all(
    products.map(async (product) => {
      const { id, quantity, price, exchangeRate, deliveredBy } = product;

      // Use findOneAndUpdate to create the Buy and populate the product and address fields in one go
      const newBuyProduct = await Buy.findOneAndUpdate(
        {
          user: userId,
          product: id,
          price: Number(price),
          quantity: Number(quantity),
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
    address: addressFromToken,
    products: buyProducts,
  });
});

export default afterSuccessfulPayment;
