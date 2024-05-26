import catchAsyncError from "../../lib/catchAsyncError.js";

const afterSuccessfulPayment = catchAsyncError(async (req, res, next) => {
  const buysId = req.buysId;

  console.log("buysId from after payment", buysId);

  res.status(200).json({
    message: "Payment Successful",
    data: buysId,
  });
});

export default afterSuccessfulPayment;
