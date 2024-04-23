import catchAsyncError from "../../lib/catchAsyncError.js";
import Rating from "../../models/RatingModel.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";

const giveRating = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;
  const user = req.user;
  const { id: productId, rate, title, comment } = req.body;

  if (!productId || !rate || !title || !comment) {
    return next(new HandleGlobalError("Please provide all fields", 404));
  }

  const convertToNumber = Number(rate);

  const createRating = await Rating.create({
    user: userId,
    product: productId,
    rate: convertToNumber,
    title,
    comment,
  });

  const createRatingData = {
    _id: String(createRating._id),
    user: {
      _id: userId,
      name: user.name,
      photo: user.photo,
    },
    product: productId,
    rate: convertToNumber,
    title,
    comment,
  };

  res.status(200).json({
    message: "New rating Created",
    data: createRatingData,
  });
});

export default giveRating;
