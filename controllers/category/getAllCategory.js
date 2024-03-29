import catchAsyncError from "../../lib/catchAsyncError.js";
import Category from "../../models/CategoryModel.js";

const getAllCategory = catchAsyncError(async (req, res, next) => {
  const allCategory = await Category.find();

  res.status(200).json({
    message: "All Categories",
    data: allCategory,
  });
});

export default getAllCategory;
