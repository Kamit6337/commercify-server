import catchAsyncError from "../../lib/catchAsyncError.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";
import verifyWebToken from "../../utils/auth/verifyWebToken.js";

const afterSuccessfulPayment = catchAsyncError(async (req, res, next) => {
  const { token } = req.query;

  if (!token) {
    return next(new HandleGlobalError("Token is not provided", 404));
  }

  const decoded = verifyWebToken(token);

  console.log("decoded", decoded);

  res.status(200).json({
    message: "Payment Successful",
    data: decoded,
  });
});

export default afterSuccessfulPayment;
