import catchAsyncError from "../../lib/catchAsyncError.js";
import Rating from "../../models/RatingModel.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";

const productRatings = catchAsyncError(async (req, res, next) => {
  const { id: productId } = req.query;

  if (!productId) {
    return next(new HandleGlobalError("Product Id is not provided", 404));
  }

  const findRatings = await Rating.find({
    product: productId,
  })
    .populate({
      path: "user",
      select: "name photo",
    })
    .lean();

  res.status(200).json({
    message: "Product Ratings",
    data: findRatings,
  });
});

export default productRatings;
