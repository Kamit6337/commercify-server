import catchAsyncError from "../lib/catchAsyncError.js";
import HandleGlobalError from "../utils/HandleGlobalError.js";
import Req from "../utils/Req.js";
import decrypt from "../utils/encryption/decrypt.js";

const paymentMiddleware = catchAsyncError(async (req, res, next) => {
  const { ords } = Req(req);

  if (!ords) {
    return next(
      new HandleGlobalError("Something went wrong with payment. Try later", 404)
    );
  }

  const { buysId } = decrypt(ords);

  req.buysId = buysId;

  next();
});

export default paymentMiddleware;
