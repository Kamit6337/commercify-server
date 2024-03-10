import Product from "../../models/ProductModel.js";

import changeUnderScoreId from "../../utils/javaScript/changeUnderScoreId.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";
import catchAsyncError from "../../lib/catchAsyncError.js";

const updateProduct = catchAsyncError(async (req, res, next) => {
  const { id, title, description, mrp, sellingPrice, category, date } =
    req.body;

  if (!id || !title || !description || !mrp || !sellingPrice || !category) {
    return next(new HandleGlobalError("Not provided all detail", 401));
  }

  await Product.findOneAndUpdate(
    {
      _id: id,
    },
    {
      title,
      description,
      mrp,
      sellingPrice,
      category,
      postedDate: date,
    },
    {
      new: true,
    }
  );

  res.status(200).json({
    message: "Product got updated",
  });
});

export default updateProduct;
