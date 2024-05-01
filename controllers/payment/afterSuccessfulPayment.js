import Buy from "../../models/BuyModel.js";
import catchAsyncError from "../../lib/catchAsyncError.js";

const afterSuccessfulPayment = catchAsyncError(async (req, res, next) => {
  const buysId = req.buysId;

  res.status(200).json({
    message: "Payment Successful",
    data: buysId,
  });
});

export default afterSuccessfulPayment;
