import catchAsyncError from "../../lib/catchAsyncError.js";
import Rating from "../../models/RatingModel.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";

const updateRating = catchAsyncError(async (req, res, next) => {
  const user = req.user;

  const { id, rate, title, comment } = req.body;

  if (!id || !rate || !title || !comment) {
    return next(new HandleGlobalError("Please provide all fields", 404));
  }

  const update = await Rating.findOneAndUpdate(
    {
      _id: id,
    },
    {
      rate: Number(rate),
      title,
      comment,
    },
    {
      new: true,
    }
  ).lean();

  update.user = {
    _id: user._id,
    name: user.name,
    photo: user.photo,
  };

  res.status(200).json({
    message: "Updated Rating",
    data: update,
  });
});
export default updateRating;
