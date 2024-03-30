import catchAsyncError from "../../lib/catchAsyncError.js";
import Buy from "../../models/BuyModel.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";

const cancelOrder = catchAsyncError(async (req, res, next) => {
  const { id } = req.body;

  if (!id) {
    return next(new HandleGlobalError("Id id not provided", 404));
  }

  const updateBuy = await Buy.findOneAndUpdate(
    {
      _id: id,
    },
    {
      isCancelled: true,
    },
    {
      new: true,
    }
  );

  res.status(200).json({
    message: "Order is cancelled",
    data: updateBuy,
  });
});

export default cancelOrder;
