import Product from "../../models/ProductModel.js";

import changeUnderScoreId from "../../utils/javaScript/changeUnderScoreId.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";
import catchAsyncError from "../../lib/catchAsyncError.js";

const getProductsName = catchAsyncError(async (req, res, next) => {
  const productsName = await Product.find().select("_id title").lean();

  if (!productsName) {
    return next(new HandleGlobalError("Error in getting product name", 404));
  }
  const productsNameId = changeUnderScoreId(productsName);

  res.status(200).json({
    message: "All products name",
    data: productsNameId,
  });
});

export default getProductsName;
