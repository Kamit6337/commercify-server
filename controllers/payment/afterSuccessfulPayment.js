import catchAsyncError from "../../lib/catchAsyncError.js";
import Buy from "../../models/BuyModel.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";

const afterSuccessfulPayment = catchAsyncError(async (req, res, next) => {
  const { sessionId } = req.query;

  if (!sessionId) {
    return next(new HandleGlobalError("Please provide ID", 404));
  }

  const products = await Buy.find({
    sessionId,
  })
    .populate("product")
    .populate("address")
    .lean()
    .sort("+createdAt");

  res.status(200).json({
    message: "Payment Successful",
    data: products,
  });
});

export default afterSuccessfulPayment;
