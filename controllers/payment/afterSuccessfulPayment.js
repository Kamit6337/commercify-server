import Buy from "../../models/BuyModel.js";
import Address from "../../models/AddressModel.js";
import catchAsyncError from "../../lib/catchAsyncError.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";
import verifyWebToken from "../../utils/auth/verifyWebToken.js";

const afterSuccessfulPayment = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;
  const { token } = req.query;

  if (!token) {
    return next(new HandleGlobalError("Token is not provided", 404));
  }

  const { products, address: addressFromToken } = verifyWebToken(token);

  const { name, mobile, address, district, state, pinCode } = addressFromToken;

  const addNewAddress = await Address.create({
    name,
    mobile: Number(mobile),
    address,
    state,
    district,
    pinCode: Number(pinCode),
  });

  const productDelieveredBy = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days

  const buyProducts = await Promise.all(
    products.map(async (product) => {
      const { id, quantity, price } = product;

      const newBuyProduct = await Buy.create({
        user: userId,
        product: id,
        price: Number(price),
        quantity: Number(quantity),
        address: addNewAddress,
        delieveredDate: productDelieveredBy,
      });

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
