import HandleGlobalError from "../../utils/HandleGlobalError.js";
import catchAsyncError from "../../lib/catchAsyncError.js";
import Product from "../../models/ProductModel.js";

const addProduct = catchAsyncError(async (req, res, next) => {
  const { title, description, mrp, sellingPrice, category } = req.body;

  if (!title || !description || !mrp || !sellingPrice || !category) {
    return next(new HandleGlobalError("Not provided all detail", 401));
  }

  await Product.create({
    title,
    description,
    mrp,
    sellingPrice,
    category,
  });

  res.status(200).json({
    message: "Product is created",
  });
});

export default addProduct;
