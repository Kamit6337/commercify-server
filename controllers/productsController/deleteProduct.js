import Product from "../../models/ProductModel.js";

import HandleGlobalError from "../../utils/HandleGlobalError.js";
import catchAsyncError from "../../lib/catchAsyncError.js";

const deleteProduct = catchAsyncError(async (req, res, next) => {
  let { idList } = req.query;

  // WORK: IF USER WANT TO DELETE ONE PRODUCT OR LIST OF PRODUCT AT SAME TIME

  if (!idList) {
    return next(new HandleGlobalError("id is not provided", 404));
  }

  if (!Array.isArray(idList)) {
    idList = [idList];
  }

  await Product.deleteMany({
    _id: { $in: idList },
  });

  res.status(200).json({
    message: "Products are deleted",
  });
});

export default deleteProduct;
