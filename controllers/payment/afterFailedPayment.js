import catchAsyncError from "../../lib/catchAsyncError.js";
import Buy from "../../models/BuyModel.js";

const afterFailedPayment = catchAsyncError(async (req, res, next) => {
  const buysId = req.buysId;

  await Buy.deleteMany({
    _id: { $in: buysId },
  });

  res.status(200).json({
    message: "Payment is Failed",
    data: buysId,
  });
});

export default afterFailedPayment;
