import catchAsyncError from "../../lib/catchAsyncError.js";
import Buy from "../../models/BuyModel.js";

const getUserBuys = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const findAllBuys = await Buy.find({
    user: userId,
  })
    .populate("product")
    .populate("address");

  res.status(200).json({
    message: "All buy products of user",
    data: findAllBuys,
  });
});

export default getUserBuys;
